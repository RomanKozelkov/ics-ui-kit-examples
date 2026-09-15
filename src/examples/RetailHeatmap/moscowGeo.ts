import { area, bbox, union, type Bbox } from "./geo";
import { MOSCOW_DISTRICTS } from "./moscowDistricts";
import type { City, MultiPoly, Territory } from "./types";

/**
 * Базовый слой географии: округа и районы Москвы (треб. 2.1, 2.2).
 *
 * Геометрия — реальная, из BI MDS (`geo.CityDistrict`), см. `moscowDistricts.ts` и
 * `scripts/importCityDistricts.mjs`. Здесь она ограничивается старой Москвой, превращается
 * в территории модуля и дополняется населением: его в источнике нет, поэтому оно мокается
 * детерминированно.
 */

export const MOSCOW: City = { id: "msk", name: "Москва" };
export const CITIES: City[] = [MOSCOW];

/** Центр города — от него считается плотность точек в моке. */
export const CITY_CENTER: [number, number] = [37.6173, 55.7558];

/** «Центральный административный округ» → «Центральный АО». */
function shortOkrugName(name: string): string {
	return name.replace(/\s*административный округ\s*/i, " АО").trim();
}

/** «район Перово» / «Войковский район» → «Перово» / «Войковский». */
function shortRayonName(name: string): string {
	return name
		.replace(/^район\s+/i, "")
		.replace(/\s+район$/i, "")
		.trim();
}

/**
 * Рабочая область — старая Москва: Троицкий и Новомосковский АО исключены.
 *
 * ТиНАО присоединены в 2012 году и по площади больше остального города, при этом точек
 * там единицы. Если оставить их, карта при открытии масштабируется на всю территорию и
 * плотная часть города становится нечитаемой (треб. 3.4). Данные в `moscowDistricts.ts`
 * остаются полными — достаточно очистить этот список, чтобы вернуть Новую Москву.
 */
const EXCLUDED_OKRUGS = ["Троицкий административный округ", "Новомосковский административный округ"];

function buildTerritories(): Territory[] {
	const excludedIds = new Set(
		MOSCOW_DISTRICTS.filter((d) => d.parentId === null && EXCLUDED_OKRUGS.includes(d.name)).map(
			(d) => d.id
		)
	);
	const included = MOSCOW_DISTRICTS.filter(
		(d) => !excludedIds.has(d.id) && !(d.parentId !== null && excludedIds.has(d.parentId))
	);
	return included.map((district) => {
		const isOkrug = district.parentId === null;
		return {
			id: `${isOkrug ? "okrug" : "rayon"}-${district.id}`,
			kind: isOkrug ? "okrug" : "rayon",
			name: isOkrug ? shortOkrugName(district.name) : shortRayonName(district.name),
			cityId: MOSCOW.id,
			parentId: district.parentId === null ? undefined : `okrug-${district.parentId}`,
			geometry: district.geometry
		} satisfies Territory;
	});
}

export const BASE_TERRITORIES: Territory[] = buildTerritories();

export const RAYONS: Territory[] = BASE_TERRITORIES.filter((t) => t.kind === "rayon");
export const OKRUGS: Territory[] = BASE_TERRITORIES.filter((t) => t.kind === "okrug");

/** Рамка каждой территории — для быстрого отсева при поиске и отсечении. */
export const TERRITORY_BBOX: Record<string, Bbox> = Object.fromEntries(
	BASE_TERRITORIES.map((t) => [t.id, bbox(t.geometry)]).filter(([, box]) => box) as [string, Bbox][]
);

export const CITY_BBOX: Bbox = (() => {
	const boxes = Object.values(TERRITORY_BBOX);
	return {
		minLng: Math.min(...boxes.map((b) => b.minLng)),
		minLat: Math.min(...boxes.map((b) => b.minLat)),
		maxLng: Math.max(...boxes.map((b) => b.maxLng)),
		maxLat: Math.max(...boxes.map((b) => b.maxLat))
	};
})();

/**
 * Геометрия рабочей области города — объединение округов. Считается лениво: объединение
 * десяти подробных контуров заметно дороже, чем всё остальное при старте модуля,
 * а нужно оно только при отсечении нарисованного брика.
 */
let cityGeometryCache: MultiPoly | null = null;
export function cityGeometry(): MultiPoly {
	if (!cityGeometryCache) cityGeometryCache = union(...OKRUGS.map((t) => t.geometry));
	return cityGeometryCache;
}

/** Пересекается ли рамка территории с заданной — дешёвый предфильтр. */
export function bboxIntersects(a: Bbox, b: Bbox): boolean {
	return !(a.maxLng < b.minLng || b.maxLng < a.minLng || a.maxLat < b.minLat || b.maxLat < a.minLat);
}

/* ---------- население (строка 11) ---------- */

/** Детерминированный псевдослучайный множитель 0…1 по строковому ключу. */
function hashUnit(key: string): number {
	let h = 2166136261;
	for (let i = 0; i < key.length; i++) {
		h ^= key.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return ((h >>> 0) % 100000) / 100000;
}

/**
 * Население базовых территорий. Известно для города, округов и районов; ниже уровня района
 * не детализируется, поэтому у нарезанного вручную брика может быть недоступно (треб. 5.3.3).
 *
 * В источнике населения нет — значение мокается, но зависит от площади района, чтобы
 * плотность выглядела правдоподобно.
 */
export const BASE_POPULATION: Record<string, number> = (() => {
	const result: Record<string, number> = {};
	const areas = RAYONS.map((t) => area(t.geometry));
	const medianArea = [...areas].sort((a, b) => a - b)[Math.floor(areas.length / 2)] || 1;

	RAYONS.forEach((rayon, i) => {
		// Крупные окраинные районы менее плотные — берём корень, а не прямую пропорцию.
		const areaFactor = Math.sqrt(areas[i] / medianArea);
		const noise = 0.6 + hashUnit(rayon.id + ":pop") * 0.9;
		result[rayon.id] = Math.round(Math.min(220000, 18000 + 75000 * areaFactor * noise));
	});

	let cityPopulation = 0;
	for (const okrug of OKRUGS) {
		let population = 0;
		for (const rayon of RAYONS) {
			if (rayon.parentId === okrug.id) population += result[rayon.id];
		}
		result[okrug.id] = population;
		cityPopulation += population;
	}
	result[MOSCOW.id] = cityPopulation;
	return result;
})();
