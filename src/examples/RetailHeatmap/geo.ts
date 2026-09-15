import * as polygonClippingNs from "polygon-clipping";
import type { MultiPoly, Pair, Poly, Ring } from "./types";

/**
 * Геометрия территорий: булевы операции над мультиполигонами и вспомогательные расчёты.
 *
 * Координаты везде в порядке GeoJSON — [lng, lat]. В Leaflet порядок обратный, конвертация
 * делается на границе (`toLatLngs` / `fromLatLngs`).
 */

// В рантайме у polygon-clipping только default-экспорт, а типы объявлены именованными —
// берём объект операций из default, сохраняя типизацию неймспейса.
const pc = ((polygonClippingNs as { default?: typeof polygonClippingNs }).default ??
	polygonClippingNs) as typeof polygonClippingNs;

/** Площадь, достаточно малая, чтобы считать результат операции артефактом округления. */
const EPS_AREA = 1e-9;

/* ---------- базовые расчёты ---------- */

/** Удвоенная знаковая площадь контура (шнуровка Гаусса). */
function signedArea2(ring: Ring): number {
	let sum = 0;
	for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
		sum += (ring[j][0] - ring[i][0]) * (ring[j][1] + ring[i][1]);
	}
	return sum;
}

/** Площадь мультиполигона в квадратных градусах (внешние контуры минус отверстия). */
export function area(mp: MultiPoly): number {
	let total = 0;
	for (const poly of mp) {
		poly.forEach((ring, i) => {
			const a = Math.abs(signedArea2(ring)) / 2;
			total += i === 0 ? a : -a;
		});
	}
	return total;
}

/** Точка внутри контура (алгоритм трассировки луча). */
function pointInRing(lng: number, lat: number, ring: Ring): boolean {
	let inside = false;
	for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
		const xi = ring[i][0];
		const yi = ring[i][1];
		const xj = ring[j][0];
		const yj = ring[j][1];
		const hit = yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
		if (hit) inside = !inside;
	}
	return inside;
}

/** Точка внутри мультиполигона: во внешнем контуре и не в отверстии. */
export function pointInMultiPoly(lng: number, lat: number, mp: MultiPoly): boolean {
	for (const poly of mp) {
		if (!poly.length || !pointInRing(lng, lat, poly[0])) continue;
		let inHole = false;
		for (let i = 1; i < poly.length; i++) {
			if (pointInRing(lng, lat, poly[i])) {
				inHole = true;
				break;
			}
		}
		if (!inHole) return true;
	}
	return false;
}

export type Bbox = { minLng: number; minLat: number; maxLng: number; maxLat: number };

export function bbox(mp: MultiPoly): Bbox | null {
	let minLng = Infinity;
	let minLat = Infinity;
	let maxLng = -Infinity;
	let maxLat = -Infinity;
	for (const poly of mp) {
		for (const [lng, lat] of poly[0] ?? []) {
			if (lng < minLng) minLng = lng;
			if (lat < minLat) minLat = lat;
			if (lng > maxLng) maxLng = lng;
			if (lat > maxLat) maxLat = lat;
		}
	}
	return Number.isFinite(minLng) ? { minLng, minLat, maxLng, maxLat } : null;
}

/** Центр масс внешних контуров — для подписи и позиционирования. */
export function centroid(mp: MultiPoly): Pair | null {
	let cx = 0;
	let cy = 0;
	let total = 0;
	for (const poly of mp) {
		const ring = poly[0];
		if (!ring?.length) continue;
		const a = Math.abs(signedArea2(ring)) / 2;
		let rx = 0;
		let ry = 0;
		for (const [lng, lat] of ring) {
			rx += lng;
			ry += lat;
		}
		cx += (rx / ring.length) * a;
		cy += (ry / ring.length) * a;
		total += a;
	}
	return total > 0 ? [cx / total, cy / total] : null;
}

/* ---------- булевы операции ---------- */

/**
 * Шаг сетки, к которой привязываются координаты перед булевыми операциями: 1e-5 градуса ≈ 1 м.
 *
 * polygon-clipping сравнивает координаты с абсолютной погрешностью, настроенной на значения
 * около единицы. На градусах (37…56) с деталями порядка 1e-5 он то и дело падает с
 * «Unable to complete output ring». Привязка входа к целочисленной сетке убирает почти все
 * вырожденные случаи: целые числа представимы в double точно.
 */
const SCALE = 1e5;

/** Ошибка булевой операции — вызывающий код отменяет операцию, а не падает целиком. */
export class GeometryError extends Error {}

function dedupeRing(ring: Ring): Ring {
	const out: Ring = [];
	for (const point of ring) {
		const last = out[out.length - 1];
		if (!last || last[0] !== point[0] || last[1] !== point[1]) out.push(point);
	}
	if (out.length > 1 && (out[0][0] !== out[out.length - 1][0] || out[0][1] !== out[out.length - 1][1])) {
		out.push([out[0][0], out[0][1]]);
	}
	return out;
}

function toGrid(mp: MultiPoly): MultiPoly {
	const result: MultiPoly = [];
	for (const poly of mp) {
		const rings: Poly = [];
		for (const ring of poly) {
			const snapped = dedupeRing(
				ring.map(([x, y]) => [Math.round(x * SCALE), Math.round(y * SCALE)] as Pair)
			);
			if (snapped.length >= 4) rings.push(snapped);
		}
		if (rings.length) result.push(rings);
	}
	return result;
}

const fromGrid = (mp: MultiPoly): MultiPoly =>
	mp.map((poly) => poly.map((ring) => ring.map(([x, y]) => [x / SCALE, y / SCALE] as Pair)));

/** Отбрасывает вырожденные части, которые возникают из-за погрешности пересечений. */
function clean(mp: MultiPoly): MultiPoly {
	return mp.filter((poly) => poly[0]?.length >= 4 && area([poly]) > EPS_AREA);
}

/** Выполняет операцию на целочисленной сетке и возвращает результат в градусах. */
function runOnGrid(
	op: (geom: MultiPoly, ...geoms: MultiPoly[]) => MultiPoly,
	name: string,
	subject: MultiPoly,
	rest: MultiPoly[]
): MultiPoly {
	const a = toGrid(subject);
	if (!a.length) return [];
	const b = rest.map(toGrid).filter((g) => g.length);
	try {
		const result = b.length ? op(a, ...b) : a;
		return clean(fromGrid(result as MultiPoly));
	} catch (error) {
		throw new GeometryError(`${name}: ${(error as Error).message}`);
	}
}

export function union(...parts: MultiPoly[]): MultiPoly {
	const nonEmpty = parts.filter((p) => p.length);
	if (!nonEmpty.length) return [];
	const [first, ...rest] = nonEmpty;
	return runOnGrid(pc.union as never, "union", first, rest);
}

/**
 * Объединение по одному куску: сбойный контур пропускается, а не рушит всю операцию.
 * Нужно там, где объединяются десятки настоящих административных контуров — на каком-нибудь
 * из них polygon-clipping почти наверняка споткнётся, и терять из-за этого всю операцию нельзя.
 */
export function unionTolerant(parts: MultiPoly[]): MultiPoly {
	let acc: MultiPoly = [];
	for (const part of parts) {
		if (!part.length) continue;
		try {
			acc = acc.length ? union(acc, part) : union(part);
		} catch (error) {
			if (!(error instanceof GeometryError)) throw error;
		}
	}
	return acc;
}

export function difference(subject: MultiPoly, ...clips: MultiPoly[]): MultiPoly {
	if (!subject.length) return [];
	return runOnGrid(pc.difference as never, "difference", subject, clips.filter((c) => c.length));
}

export function intersection(subject: MultiPoly, ...clips: MultiPoly[]): MultiPoly {
	if (!subject.length || clips.some((c) => !c.length)) return [];
	return runOnGrid(pc.intersection as never, "intersection", subject, clips);
}

/** Пересекаются ли геометрии (быстрая проверка по bbox + точная по площади). */
export function intersects(a: MultiPoly, b: MultiPoly): boolean {
	const ba = bbox(a);
	const bb = bbox(b);
	if (!ba || !bb) return false;
	if (ba.maxLng < bb.minLng || bb.maxLng < ba.minLng) return false;
	if (ba.maxLat < bb.minLat || bb.maxLat < ba.minLat) return false;
	return intersection(a, b).length > 0;
}

/** Доля площади `part`, попавшая внутрь `whole` (0…1). */
export function coverageRatio(part: MultiPoly, whole: MultiPoly): number {
	const partArea = area(part);
	if (partArea <= EPS_AREA) return 0;
	return area(intersection(part, whole)) / partArea;
}

/* ---------- конвертация для Leaflet ---------- */

/** Мультиполигон → вложенные массивы [lat, lng] для `L.polygon`. */
export function toLatLngs(mp: MultiPoly): [number, number][][][] {
	return mp.map((poly) => poly.map((ring) => ring.map(([lng, lat]) => [lat, lng] as [number, number])));
}

/** Контур из [lat, lng] → полигон в порядке GeoJSON, с замыканием контура. */
export function fromLatLngs(latlngs: [number, number][]): MultiPoly {
	const ring: Ring = latlngs.map(([lat, lng]) => [lng, lat] as Pair);
	if (ring.length < 3) return [];
	const [firstLng, firstLat] = ring[0];
	const [lastLng, lastLat] = ring[ring.length - 1];
	if (firstLng !== lastLng || firstLat !== lastLat) ring.push([firstLng, firstLat]);
	return [[ring] as Poly];
}

/** Прямоугольник по двум углам — для операций разреза и выделения. */
export function rectangle(a: Pair, b: Pair): MultiPoly {
	const [x1, x2] = a[0] < b[0] ? [a[0], b[0]] : [b[0], a[0]];
	const [y1, y2] = a[1] < b[1] ? [a[1], b[1]] : [b[1], a[1]];
	return [
		[
			[
				[x1, y1],
				[x2, y1],
				[x2, y2],
				[x1, y2],
				[x1, y1]
			]
		]
	];
}

/**
 * Полоса вдоль ломаной шириной `width` градусов — геометрия «разреза» территории:
 * вычитание такой полосы разбивает территорию на части.
 */
export function lineCorridor(line: Pair[], width: number): MultiPoly {
	const half = Math.max(width, 1e-6) / 2;
	const segments: MultiPoly[] = [];
	for (let i = 1; i < line.length; i++) {
		const [x1, y1] = line[i - 1];
		const [x2, y2] = line[i];
		const dx = x2 - x1;
		const dy = y2 - y1;
		const len = Math.hypot(dx, dy);
		if (len < 1e-12) continue;
		const nx = (-dy / len) * half;
		const ny = (dx / len) * half;
		// Удлиняем сегмент на полширины, чтобы соседние звенья перекрывались без зазоров.
		const ex = (dx / len) * half;
		const ey = (dy / len) * half;
		segments.push([
			[
				[
					[x1 - ex + nx, y1 - ey + ny],
					[x2 + ex + nx, y2 + ey + ny],
					[x2 + ex - nx, y2 + ey - ny],
					[x1 - ex - nx, y1 - ey - ny],
					[x1 - ex + nx, y1 - ey + ny]
				]
			]
		]);
	}
	return union(...segments);
}

/** Разбивает мультиполигон на отдельные связные части. */
export function explode(mp: MultiPoly): MultiPoly[] {
	return mp.map((poly) => [poly]);
}
