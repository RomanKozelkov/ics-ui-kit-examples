import {
	GeometryError,
	area,
	bbox,
	difference,
	explode,
	intersection,
	pointInMultiPoly,
	union,
	unionTolerant
} from "./geo";
import { RAYON_EMPLOYEE, TRADE_POINTS } from "./mockData";
import {
	BASE_TERRITORIES,
	MOSCOW,
	OKRUGS,
	RAYONS,
	TERRITORY_BBOX,
	bboxIntersects
} from "./moscowGeo";
import type { MultiPoly, Pair, Territory, TradePoint } from "./types";

/**
 * Модель территорий и операции нарезки (раздел 2).
 *
 * Базовый слой (округа и районы) не меняется никогда. Кастомные брики лежат поверх него,
 * а отображаемая («эффективная») геометрия базовой территории — это её геометрия за вычетом
 * всех бриков. Отсюда следуют инварианты треб. 2.4: брики не перекрываются между собой,
 * каждая точка принадлежит ровно одной территории, удаление брика возвращает территорию
 * в исходное состояние без отдельной операции.
 */

/**
 * Базовый район каждой точки — считается один раз, от бриков не зависит. Контуры настоящие
 * и подробные, поэтому сначала отсекаем район по рамке и только потом проверяем вхождение.
 */
const BASE_POINT_RAYON: Record<string, string> = (() => {
	const result: Record<string, string> = {};
	for (const point of TRADE_POINTS) {
		for (const rayon of RAYONS) {
			const box = TERRITORY_BBOX[rayon.id];
			if (!box) continue;
			if (point.lng < box.minLng || point.lng > box.maxLng) continue;
			if (point.lat < box.minLat || point.lat > box.maxLat) continue;
			if (pointInMultiPoly(point.lng, point.lat, rayon.geometry)) {
				result[point.code] = rayon.id;
				break;
			}
		}
	}
	return result;
})();

export interface TerritoryModel {
	/** Базовые территории и кастомные брики — единым списком (треб. 2.6). */
	all: Territory[];
	bricks: Territory[];
	byId: Record<string, Territory>;
	/** Отображаемая геометрия: у базовых — за вычетом бриков, у брика — своя. */
	effective: Record<string, MultiPoly>;
	/** Листовые территории: брики и остатки районов. Округ агрегирует свои районы. */
	pointTerritoryId: Record<string, string>;
	pointsByTerritory: Record<string, TradePoint[]>;
	childRayons: Record<string, string[]>;
}

/** Территория считается исчезнувшей, если её остаток меньше этой доли исходной площади. */
const VANISHED_RATIO = 0.002;

/**
 * Булевы операции над настоящими контурами изредка срываются на вырожденных пересечениях.
 * Такой отказ отменяет операцию, а не роняет модуль: вызывающий код получает запасное значение
 * и показывает пользователю, что ничего не изменилось.
 */
function safeGeometry<T>(run: () => T, fallback: T): T {
	try {
		return run();
	} catch (error) {
		if (error instanceof GeometryError) return fallback;
		throw error;
	}
}

export function buildModel(bricks: Territory[]): TerritoryModel {
	const all = [...BASE_TERRITORIES, ...bricks];
	const byId: Record<string, Territory> = Object.fromEntries(all.map((t) => [t.id, t]));
	const brickUnion = unionTolerant(bricks.map((b) => b.geometry));

	const effective: Record<string, MultiPoly> = {};
	for (const territory of BASE_TERRITORIES) {
		// Отказ вычитания на одной территории не должен ломать карту целиком —
		// в худшем случае она нарисуется без выреза под брик.
		effective[territory.id] = brickUnion.length
			? safeGeometry(() => difference(territory.geometry, brickUnion), territory.geometry)
			: territory.geometry;
	}
	for (const brick of bricks) effective[brick.id] = brick.geometry;

	// Каждая точка — в свой брик, иначе в остаток базового района.
	const pointTerritoryId: Record<string, string> = {};
	const pointsByTerritory: Record<string, TradePoint[]> = {};
	for (const territory of all) pointsByTerritory[territory.id] = [];
	for (const point of TRADE_POINTS) {
		const brick = bricks.find((b) => pointInMultiPoly(point.lng, point.lat, b.geometry));
		const id = brick?.id ?? BASE_POINT_RAYON[point.code];
		if (!id) continue;
		pointTerritoryId[point.code] = id;
		pointsByTerritory[id].push(point);
	}
	// Округ собирает точки своих районов (точки, ушедшие в брики, в округ не попадают).
	const childRayons: Record<string, string[]> = {};
	for (const okrug of OKRUGS) {
		const children = RAYONS.filter((r) => r.parentId === okrug.id).map((r) => r.id);
		childRayons[okrug.id] = children;
		pointsByTerritory[okrug.id] = children.flatMap((id) => pointsByTerritory[id]);
	}

	return { all, bricks, byId, effective, pointTerritoryId, pointsByTerritory, childRayons };
}

/** Территории, которые нужно рисовать и показывать в списке: с непустой геометрией. */
export function visibleTerritories(model: TerritoryModel): Territory[] {
	return model.all.filter((t) => {
		const eff = model.effective[t.id];
		if (!eff?.length) return false;
		if (t.kind === "brick") return true;
		return area(eff) / Math.max(area(t.geometry), 1e-12) > VANISHED_RATIO;
	});
}

/** Точки внутри произвольной геометрии — для предпросмотра создаваемого брика (треб. 2.4). */
export function pointsInGeometry(geometry: MultiPoly, points: TradePoint[] = TRADE_POINTS) {
	const box = bbox(geometry);
	if (!box) return [];
	return points.filter(
		(p) =>
			p.lng >= box.minLng &&
			p.lng <= box.maxLng &&
			p.lat >= box.minLat &&
			p.lat <= box.maxLat &&
			pointInMultiPoly(p.lng, p.lat, geometry)
	);
}

/* ---------- операции нарезки ---------- */

/** Базовая территория, которой принадлежит бо́льшая часть геометрии, — родитель брика. */
function dominantParent(geometry: MultiPoly): Territory | undefined {
	const box = bbox(geometry);
	if (!box) return undefined;
	let best: Territory | undefined;
	let bestArea = 0;
	for (const rayon of RAYONS) {
		// Пересечение подробных контуров дорогое — сначала отсекаем по рамке.
		const rb = TERRITORY_BBOX[rayon.id];
		if (!rb || !bboxIntersects(box, rb)) continue;
		const overlap = area(intersection(geometry, rayon.geometry));
		if (overlap > bestArea) {
			bestArea = overlap;
			best = rayon;
		}
	}
	return best;
}

let brickSequence = 0;
const nextBrickId = () => `brick-${++brickSequence}`;

function makeBrick(geometry: MultiPoly, name?: string): Territory {
	const parent = dominantParent(geometry);
	return {
		id: nextBrickId(),
		kind: "brick",
		name: name ?? `Брик ${brickSequence}`,
		cityId: MOSCOW.id,
		geometry,
		parentId: parent?.id,
		employeeId: parent ? RAYON_EMPLOYEE[parent.id] : undefined
	};
}

/**
 * Геометрия нового брика: обрезается по рабочей области города и по уже существующим брикам,
 * чтобы брики не перекрывались (треб. 2.4).
 */
function normalizeBrickGeometry(
	geometry: MultiPoly,
	bricks: Territory[],
	exceptId?: string
): MultiPoly {
	// Брик не должен выходить за пределы города. Вместо объединения всех округов берём только
	// районы, чьи рамки задевает нарисованная область, — это на порядок дешевле.
	const box = bbox(geometry);
	if (!box) return [];
	const touched = RAYONS.filter((r) => {
		const rb = TERRITORY_BBOX[r.id];
		return rb && bboxIntersects(box, rb);
	});
	if (!touched.length) return [];
	const cityMask = unionTolerant(touched.map((r) => r.geometry));
	// Если маску собрать не удалось, лучше оставить брик неподрезанным, чем отменить операцию.
	const clipped = cityMask.length
		? safeGeometry(() => intersection(geometry, cityMask), geometry)
		: geometry;
	if (!clipped.length) return [];
	const others = bricks.filter((b) => b.id !== exceptId);
	return others.length ? difference(clipped, union(...others.map((b) => b.geometry))) : clipped;
}

/** Сценарии 2.3.3 и 2.3.4: нарисованная область становится бриком. */
export function createBrick(bricks: Territory[], geometry: MultiPoly, name?: string): Territory[] {
	return safeGeometry(() => {
		const normalized = normalizeBrickGeometry(geometry, bricks);
		if (!normalized.length) return bricks;
		return [...bricks, makeBrick(normalized, name)];
	}, bricks);
}

/** Сценарий 2.3.2: брик из нескольких целых территорий. */
export function mergeTerritories(
	model: TerritoryModel,
	ids: string[],
	name?: string
): Territory[] {
	return safeGeometry(() => {
		const parts = ids.map((id) => model.effective[id] ?? []).filter((g) => g.length);
		if (parts.length < 2) return model.bricks;
		const merged = union(...parts);
		if (!merged.length) return model.bricks;
		// Брики, вошедшие в объединение, растворяются в новом.
		const rest = model.bricks.filter((b) => !ids.includes(b.id));
		const brick = makeBrick(normalizeBrickGeometry(merged, rest), name);
		return brick.geometry.length ? [...rest, brick] : model.bricks;
	}, model.bricks);
}

/** Сценарий 2.3.1: разрез территории ломаной — каждая часть становится отдельным бриком. */
export function splitTerritory(
	model: TerritoryModel,
	targetId: string,
	corridor: MultiPoly
): Territory[] {
	const target = model.byId[targetId];
	const geometry = model.effective[targetId];
	if (!target || !geometry?.length) return model.bricks;
	return safeGeometry(() => splitUnsafe(model, target, geometry, corridor), model.bricks);
}

function splitUnsafe(
	model: TerritoryModel,
	target: Territory,
	geometry: MultiPoly,
	corridor: MultiPoly
): Territory[] {
	const targetId = target.id;
	const pieces = explode(difference(geometry, corridor));
	if (pieces.length < 2) return model.bricks;
	// Полоса разреза не должна остаться ничейной территорией — отдаём её первой части.
	const strip = intersection(geometry, corridor);
	const parts = pieces.map((piece, i) => (i === 0 && strip.length ? union(piece, strip) : piece));

	const rest = model.bricks.filter((b) => b.id !== targetId);
	const baseName = target.kind === "brick" ? target.name : `${target.name}`;
	const created = parts.map((part, i) =>
		makeBrick(normalizeBrickGeometry(part, rest), `${baseName} · часть ${i + 1}`)
	);
	return [...rest, ...created.filter((b) => b.geometry.length)];
}

/** Сценарии 2.3.5 и 2.3.6: изменение границ существующего брика. */
export function updateBrickGeometry(
	bricks: Territory[],
	id: string,
	geometry: MultiPoly
): Territory[] {
	return safeGeometry(() => {
		const normalized = normalizeBrickGeometry(geometry, bricks, id);
		if (!normalized.length) return bricks;
		return bricks.map((b) => (b.id === id ? { ...b, geometry: normalized } : b));
	}, bricks);
}

/** Переименование брика: имя задаёт пользователь, геометрия и привязки не меняются. */
export function renameBrick(bricks: Territory[], id: string, name: string): Territory[] {
	const trimmed = name.trim();
	if (!trimmed) return bricks;
	return bricks.map((b) => (b.id === id && b.name !== trimmed ? { ...b, name: trimmed } : b));
}

/** Сценарий 2.3.7: удаление брика — территория возвращается в исходное состояние. */
export function deleteBrick(bricks: Territory[], id: string): Territory[] {
	return bricks.filter((b) => b.id !== id);
}

/** Сценарий 2.3.3: вырезать часть территории в брик, остаток остаётся базовой территорией. */
export function carveFromTerritory(
	model: TerritoryModel,
	targetId: string,
	geometry: MultiPoly,
	name?: string
): Territory[] {
	const target = model.effective[targetId];
	if (!target?.length) return model.bricks;
	const piece = intersection(geometry, target);
	if (!piece.length) return model.bricks;
	return createBrick(model.bricks, piece, name);
}

/** Стартовая нарезка прототипа: пара бриков, чтобы слой был не пустым при открытии. */
export function createInitialBricks(): Territory[] {
	brickSequence = 0;
	// Берём два района в центре — там плотность точек наибольшая и брики хорошо видно.
	const seeds = [...RAYONS]
		.filter((r) => (TERRITORY_BBOX[r.id]?.minLat ?? 0) > 55.7 && (TERRITORY_BBOX[r.id]?.maxLat ?? 0) < 55.8)
		.sort((a, b) => a.name.localeCompare(b.name))
		.slice(0, 2);
	let bricks: Territory[] = [];
	for (const source of seeds) bricks = createBrick(bricks, source.geometry);
	return bricks;
}

/** Центр геометрии в порядке Leaflet — для подписи и центрирования карты. */
export function territoryCenter(geometry: MultiPoly): Pair | null {
	const box = bbox(geometry);
	return box ? [(box.minLat + box.maxLat) / 2, (box.minLng + box.maxLng) / 2] : null;
}
