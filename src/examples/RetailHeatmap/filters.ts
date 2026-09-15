import { CITIES } from "./moscowGeo";
import { EMPLOYEES, employeeChain } from "./mockData";
import {
	CATEGORIES,
	NETWORK_TYPES,
	POINT_TYPES,
	TOP50_VALUES,
	type CategoryCode,
	type NetworkType,
	type PointType,
	type Territory,
	type Top50Key,
	type TradePoint
} from "./types";

/**
 * Фильтры брикового модуля (раздел 3).
 *
 * Значение по умолчанию — выбраны все значения измерения (треб. 3.2), поэтому состояние хранит
 * явные списки. Измерение считается применённым, когда выбраны не все значения; измерения
 * комбинируются по «И» (треб. 3.3).
 */

/** Измерения фильтрации — ключи совпадают с полями `FilterState`. */
export type FilterDimension = "cities" | "types" | "categories" | "top50" | "networks" | "employees";

export interface FilterState {
	cities: string[];
	types: PointType[];
	categories: CategoryCode[];
	top50: Top50Key[];
	networks: NetworkType[];
	employees: string[];
}

/** Полный набор значений измерения — он же значение по умолчанию. */
export const ALL_VALUES: { [K in FilterDimension]: FilterState[K] } = {
	cities: CITIES.map((c) => c.id),
	types: POINT_TYPES.map((t) => t.key),
	categories: [...CATEGORIES],
	top50: TOP50_VALUES.map((t) => t.key),
	networks: NETWORK_TYPES.map((n) => n.key),
	employees: EMPLOYEES.map((e) => e.id)
};

export const createDefaultFilters = (): FilterState => ({
	cities: [...ALL_VALUES.cities],
	types: [...ALL_VALUES.types],
	categories: [...ALL_VALUES.categories],
	top50: [...ALL_VALUES.top50],
	networks: [...ALL_VALUES.networks],
	employees: [...ALL_VALUES.employees]
});

export const FILTER_DIMENSIONS: FilterDimension[] = [
	"cities",
	"types",
	"categories",
	"top50",
	"networks",
	"employees"
];

/** Измерение ограничивает выборку, если выбраны не все его значения. */
export function isDimensionActive(state: FilterState, dimension: FilterDimension): boolean {
	return state[dimension].length < ALL_VALUES[dimension].length;
}

/** Сколько измерений применено — для индикатора на кнопке фильтров. */
export function activeDimensionCount(state: FilterState): number {
	return FILTER_DIMENSIONS.filter((d) => isDimensionActive(state, d)).length;
}

export const hasActiveFilters = (state: FilterState) => activeDimensionCount(state) > 0;

/** Значение подсвечено в блоке статистики, только когда измерение действительно ограничено. */
export function isValueSelected(
	state: FilterState,
	dimension: FilterDimension,
	value: string
): boolean {
	return isDimensionActive(state, dimension) && (state[dimension] as string[]).includes(value);
}

/**
 * Клик по значению в блоке статистики (треб. 5.5.1, 5.5.5):
 * из полного набора — оставить одно значение, из ограниченного — добавить или убрать,
 * при опустошении — вернуть полный набор.
 */
export function toggleFilterValue(
	state: FilterState,
	dimension: FilterDimension,
	value: string
): FilterState {
	const current = state[dimension] as string[];
	let next: string[];
	if (!isDimensionActive(state, dimension)) {
		next = [value];
	} else if (current.includes(value)) {
		next = current.filter((v) => v !== value);
		if (!next.length) next = [...(ALL_VALUES[dimension] as string[])];
	} else {
		next = [...current, value];
	}
	return { ...state, [dimension]: next } as FilterState;
}

export function setDimension(
	state: FilterState,
	dimension: FilterDimension,
	values: string[]
): FilterState {
	// Пустой выбор в мультиселекте равнозначен «выбраны все».
	const next = values.length ? values : [...(ALL_VALUES[dimension] as string[])];
	return { ...state, [dimension]: next } as FilterState;
}

/* ---------- применение ---------- */

/** Проверка точки по всем измерениям (треб. 3.3, 3.5). */
export function matchesFilters(point: TradePoint, state: FilterState): boolean {
	if (isDimensionActive(state, "cities") && !state.cities.includes(point.cityId)) return false;
	if (isDimensionActive(state, "types") && !state.types.includes(point.type)) return false;
	if (isDimensionActive(state, "categories") && !state.categories.includes(point.category)) return false;
	if (isDimensionActive(state, "top50")) {
		const key: Top50Key = point.top50 ? "top" : "rest";
		if (!state.top50.includes(key)) return false;
	}
	if (isDimensionActive(state, "networks") && !state.networks.includes(point.network)) return false;
	if (isDimensionActive(state, "employees")) {
		// Сотрудник может быть выбран на любом уровне — сверяем всю цепочку MR → DSM → ASM.
		const chain = employeeChain(point.mrId);
		if (!chain.some((id) => state.employees.includes(id))) return false;
	}
	return true;
}

export const applyFilters = (points: TradePoint[], state: FilterState) =>
	points.filter((p) => matchesFilters(p, state));

/**
 * Территория проходит фильтр по сотруднику, если закреплённый за ней сотрудник выбран
 * (треб. 3.6). У базовых округов и районов сотрудник не назначен — они остаются видимыми.
 */
export function matchesTerritoryFilters(territory: Territory, state: FilterState): boolean {
	if (isDimensionActive(state, "cities") && !state.cities.includes(territory.cityId)) return false;
	if (isDimensionActive(state, "employees") && territory.employeeId) {
		const chain = employeeChain(territory.employeeId);
		if (!chain.some((id) => state.employees.includes(id))) return false;
	}
	return true;
}
