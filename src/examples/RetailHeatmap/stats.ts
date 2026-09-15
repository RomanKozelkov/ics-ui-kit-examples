import { employeeChain } from "./mockData";
import {
	NETWORK_TYPES,
	POINT_TYPES,
	type CategoryCode,
	type ColorMetric,
	type EmployeeRole,
	type NetworkType,
	type PointType,
	type Top50Key,
	type TradePoint
} from "./types";

/**
 * Агрегаты по набору торговых точек. Набор всегда приходит уже отфильтрованным, поэтому
 * статистика и раскраска автоматически учитывают действующие фильтры (треб. 3.7).
 */
export interface Stats {
	count: number;
	/** Σ mAVG offtake, RUB (строка 13). */
	offtake: number;
	/** Σ mAVG turnover, RUB (строка 14). */
	turnover: number;
	byType: Record<PointType, number>;
	byCategory: Record<CategoryCode, number>;
	byTop50: Record<Top50Key, number>;
	byNetwork: Record<NetworkType, number>;
	/** Количество точек по сотруднику любого уровня: ключ — id сотрудника. */
	byEmployee: Record<string, number>;
}

export function computeStats(points: TradePoint[]): Stats {
	const byType = Object.fromEntries(POINT_TYPES.map((t) => [t.key, 0])) as Record<PointType, number>;
	const byNetwork = Object.fromEntries(NETWORK_TYPES.map((n) => [n.key, 0])) as Record<
		NetworkType,
		number
	>;
	const byCategory: Record<CategoryCode, number> = {};
	const byTop50: Record<Top50Key, number> = { top: 0, rest: 0 };
	const byEmployee: Record<string, number> = {};
	let offtake = 0;
	let turnover = 0;

	for (const point of points) {
		byType[point.type]++;
		byNetwork[point.network]++;
		byCategory[point.category] = (byCategory[point.category] ?? 0) + 1;
		byTop50[point.top50 ? "top" : "rest"]++;
		// Точка учитывается своему MR и всем его руководителям.
		for (const id of employeeChain(point.mrId)) byEmployee[id] = (byEmployee[id] ?? 0) + 1;
		offtake += point.offtake;
		turnover += point.turnover;
	}

	return { count: points.length, offtake, turnover, byType, byCategory, byTop50, byNetwork, byEmployee };
}

export const EMPTY_STATS: Stats = computeStats([]);

/** Значение метрики раскраски территории (треб. 7.1). */
export function metricValue(stats: Stats, metric: ColorMetric): number {
	if (metric === "offtake") return stats.offtake;
	if (metric === "turnover") return stats.turnover;
	return stats.count;
}

/** Порядок уровней в блоке «Сотрудники». */
export const ROLE_ORDER: EmployeeRole[] = ["MR", "DSM", "ASM"];

/* ---------- тепловая шкала ---------- */

/** Палитра YlOrRd — как в исходном прототипе. */
const HEAT: [number, number, number][] = [
	[255, 255, 178],
	[254, 204, 92],
	[253, 141, 60],
	[240, 59, 32],
	[189, 0, 38]
];

export function heatColor(t: number): string {
	const clamped = Math.max(0, Math.min(1, Number.isFinite(t) ? t : 0));
	const segment = clamped * (HEAT.length - 1);
	const i = Math.min(HEAT.length - 2, Math.floor(segment));
	const f = segment - i;
	const a = HEAT[i];
	const b = HEAT[i + 1];
	const ch = (k: number) => Math.round(a[k] + (b[k] - a[k]) * f);
	return `rgb(${ch(0)},${ch(1)},${ch(2)})`;
}

export const HEAT_GRADIENT =
	"linear-gradient(90deg,rgb(255,255,178),rgb(254,204,92),rgb(253,141,60),rgb(240,59,32),rgb(189,0,38))";
