import { TRADE_POINTS } from "./mockData";
import { TYPES, type Category, type PointType, type TradePoint } from "./types";

export interface BrickStats {
	count: number;
	byType: Record<PointType, number>;
	byCat: Record<Category, number>;
	totalTurnover: number;
	population: number;
	/** Ключ — имя менеджера или "Unknown". */
	managers: Record<string, number>;
}

export interface Brick {
	id: string;
	name: string;
	/** Вершины полигона: [lat, lng]. */
	latlngs: [number, number][];
	stats: BrickStats;
	/** Цвет хороплета по плотности (heatColor). */
	color: string;
}

/** Палитра тепловой шкалы (YlOrRd), как в референсе. */
const HEAT: [number, number, number][] = [
	[255, 255, 178],
	[254, 204, 92],
	[253, 141, 60],
	[240, 59, 32],
	[189, 0, 38]
];

export function heatColor(t: number): string {
	t = Math.max(0, Math.min(1, t));
	const seg = t * (HEAT.length - 1);
	const i = Math.min(HEAT.length - 2, Math.floor(seg));
	const f = seg - i;
	const a = HEAT[i];
	const b = HEAT[i + 1];
	const ch = (k: number) => Math.round(a[k] + (b[k] - a[k]) * f);
	return `rgb(${ch(0)},${ch(1)},${ch(2)})`;
}

/** Точка в полигоне (ray casting). poly — массив [lat, lng]. */
export function pointInPoly(lat: number, lng: number, poly: [number, number][]): boolean {
	let inside = false;
	for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
		const yi = poly[i][0];
		const xi = poly[i][1];
		const yj = poly[j][0];
		const xj = poly[j][1];
		const hit = yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
		if (hit) inside = !inside;
	}
	return inside;
}

export function pointsInPolygon(poly: [number, number][]): TradePoint[] {
	return TRADE_POINTS.filter((p) => pointInPoly(p.lat, p.lng, poly));
}

export function computeStats(points: TradePoint[]): BrickStats {
	const byType = {} as Record<PointType, number>;
	TYPES.forEach((t) => (byType[t.key] = 0));
	const byCat: Record<Category, number> = { A: 0, B: 0, C: 0, D: 0 };
	const managers: Record<string, number> = {};
	let totalTurnover = 0;
	let population = 0;
	for (const p of points) {
		byType[p.type]++;
		byCat[p.cat]++;
		totalTurnover += p.turnover;
		population += p.pop;
		const m = p.manager || "Unknown";
		managers[m] = (managers[m] || 0) + 1;
	}
	return { count: points.length, byType, byCat, totalTurnover, population, managers };
}

export const GLOBAL_STATS = computeStats(TRADE_POINTS);

/** 3 предустановленных брика (координаты из референса). */
const SEED: [number, number][][] = [
	[
		[55.792, 37.555],
		[55.804, 37.665],
		[55.762, 37.7],
		[55.745, 37.585]
	],
	[
		[55.704, 37.498],
		[55.712, 37.602],
		[55.66, 37.628],
		[55.648, 37.52]
	],
	[
		[55.772, 37.66],
		[55.781, 37.748],
		[55.733, 37.756],
		[55.722, 37.662]
	]
];

/** Создаёт брик из геометрии (считает агрегаты по точкам внутри). Цвет назначает colorize. */
export function makeBrick(id: string, name: string, latlngs: [number, number][]): Brick {
	return { id, name, latlngs, stats: computeStats(pointsInPolygon(latlngs)), color: "#cbd5e1" };
}

/** Пере-нормализует heat-цвета бриков по максимальной плотности (количеству точек). */
export function colorize(bricks: Brick[]): Brick[] {
	const max = Math.max(1, ...bricks.map((b) => b.stats.count));
	return bricks.map((b) => ({ ...b, color: heatColor(b.stats.count / max) }));
}

export const INITIAL_BRICKS: Brick[] = colorize(
	SEED.map((latlngs, i) => makeBrick("b" + (i + 1), "Брик " + (i + 1), latlngs))
);
