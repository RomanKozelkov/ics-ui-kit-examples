import { coverageRatio, pointInMultiPoly } from "./geo";
import { HOSPITALS } from "./mockData";
import { BASE_POPULATION, BASE_TERRITORIES, MOSCOW } from "./moscowGeo";
import type { MultiPoly, Territory } from "./types";

/**
 * Заглушка справочного API территории.
 *
 * Прототип работает на моках, но обращения оформлены как вызовы сервиса: те же входные данные
 * (геометрия или идентификатор территории) и тот же результат, что ожидается от реального
 * бэкенда. Контракт, требования и вопросы к API — в `API-REQUIREMENTS.md`.
 */

/** Откуда получено значение — влияет на подпись в интерфейсе. */
export type DemographySource =
	| "base" // территория базового слоя, значение известно напрямую
	| "aggregated" // брик собран из целых районов, значение просуммировано
	| "unavailable" // брик нарезан внутри района, детализации ниже района нет
	| "pending"; // черновик брика: значение считается после создания

export interface TerritoryDemography {
	/** Население (строка 11); `null` — значение недоступно для этой геометрии. */
	population: number | null;
	/** Больниц (строка 10) — считается по точкам-больницам, доступно для любой геометрии. */
	hospitals: number;
	source: DemographySource;
}

/** Доля площади, начиная с которой район считается вошедшим в брик целиком. */
const WHOLE_RAYON_THRESHOLD = 0.97;
/**
 * Доля площади, ниже которой пересечение считается шумом границ, а не вхождением района.
 * У настоящих административных контуров соседи перекрываются на единицы метров, и без этого
 * допуска брик из целых районов всегда «задевал» бы соседей и оставался без населения.
 */
const BOUNDARY_NOISE = 0.03;
/** Допустимая доля площади брика, не покрытая целыми районами. */
const RESIDUAL_THRESHOLD = 0.04;

/**
 * Число больниц внутри геометрии. Больницы — подмножество торговых точек (подтипы
 * «Больница — взрослая / детская»), поэтому показатель считается по координатам и работает
 * для кастомного брика. Фильтры панели на него не влияют: выводится общее количество
 * больниц на территории (комментарий ICS к строке 10).
 */
export function countHospitals(geometry: MultiPoly): number {
	let count = 0;
	for (const hospital of HOSPITALS) {
		if (pointInMultiPoly(hospital.lng, hospital.lat, geometry)) count++;
	}
	return count;
}

/**
 * Население произвольной геометрии. Реальный сервис отдаёт население по справочнику
 * административных единиц, детализации ниже района нет — поэтому значение известно, только
 * если геометрия складывается из целых районов (треб. 5.3.3).
 */
function populationOfGeometry(geometry: MultiPoly): number | null {
	let population = 0;
	let covered = 0;
	for (const rayon of BASE_TERRITORIES) {
		if (rayon.kind !== "rayon") continue;
		const ratio = coverageRatio(rayon.geometry, geometry);
		if (ratio >= WHOLE_RAYON_THRESHOLD) {
			population += BASE_POPULATION[rayon.id] ?? 0;
			covered += ratio;
		} else if (ratio > BOUNDARY_NOISE) {
			// Район вошёл частично — разложить его население по площади нельзя.
			return null;
		}
	}
	if (!covered) return null;
	// Брик может выходить за пределы найденных районов — тогда часть населения неизвестна.
	const residual = 1 - coverageRatio(geometry, unionOfWholeRayons(geometry));
	return residual > RESIDUAL_THRESHOLD ? null : population;
}

/** Геометрия целиком вошедших районов — для оценки непокрытого остатка брика. */
function unionOfWholeRayons(geometry: MultiPoly): MultiPoly {
	const parts: MultiPoly = [];
	for (const rayon of BASE_TERRITORIES) {
		if (rayon.kind !== "rayon") continue;
		if (coverageRatio(rayon.geometry, geometry) >= WHOLE_RAYON_THRESHOLD) parts.push(...rayon.geometry);
	}
	return parts;
}

/** Демография территории: для базовых — из справочника, для брика — расчётом по геометрии. */
export function fetchTerritoryDemography(territory: Territory): TerritoryDemography {
	const hospitals = countHospitals(territory.geometry);
	if (territory.kind !== "brick") {
		return { population: BASE_POPULATION[territory.id] ?? null, hospitals, source: "base" };
	}
	const population = populationOfGeometry(territory.geometry);
	return { population, hospitals, source: population === null ? "unavailable" : "aggregated" };
}

/** Демография рабочей области города — для состояния «ничего не выбрано». */
export function fetchCityDemography(cityId: string = MOSCOW.id): TerritoryDemography {
	return {
		population: BASE_POPULATION[cityId] ?? null,
		hospitals: HOSPITALS.length,
		source: "base"
	};
}

/** Пояснение к недоступному населению — показывается вместо значения (треб. 5.3.3). */
export const POPULATION_UNAVAILABLE_HINT =
	"Население доступно на уровне города, округа и района. Для брика, нарезанного внутри района, значение не рассчитывается.";

/**
 * Пояснение к населению черновика. Разложение по районам — самый дорогой расчёт территории,
 * и на каждое движение мыши его не выполняют: значение появляется, когда брик создан.
 */
export const POPULATION_PENDING_HINT = "Население рассчитывается после создания брика.";

/** Демография черновика брика: точки и больницы считаются сразу, население — после создания. */
export function draftDemography(geometry: MultiPoly): TerritoryDemography {
	return { population: null, hospitals: countHospitals(geometry), source: "pending" };
}
