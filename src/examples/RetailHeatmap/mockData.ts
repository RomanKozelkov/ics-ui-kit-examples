import type { Category, PointType, TradePoint } from "./types";

const MANAGERS = [
	"Иванов А.",
	"Петрова Е.",
	"Смирнов Д.",
	"Кузнецова О.",
	"Соколов М.",
	"Попова И.",
	"Лебедев К.",
	"Новикова Т.",
	"Морозов С.",
	"Волкова Н.",
	"Зайцев П.",
	"Орлова М."
];

// Гауссовы центры распределения точек по округам Москвы.
const CENTERS = [
	{ n: "Центр", la: 55.7558, lo: 37.6173, w: 0.18, sp: 0.016 },
	{ n: "Север", la: 55.845, lo: 37.605, w: 0.12, sp: 0.03 },
	{ n: "Юг", la: 55.64, lo: 37.62, w: 0.13, sp: 0.032 },
	{ n: "Восток", la: 55.787, lo: 37.79, w: 0.12, sp: 0.03 },
	{ n: "Запад", la: 55.735, lo: 37.455, w: 0.12, sp: 0.03 },
	{ n: "Юго-Запад", la: 55.66, lo: 37.51, w: 0.13, sp: 0.03 },
	{ n: "Северо-Восток", la: 55.86, lo: 37.66, w: 0.1, sp: 0.03 },
	{ n: "Юго-Восток", la: 55.69, lo: 37.745, w: 0.1, sp: 0.028 }
];

const TYPE_WEIGHTS: [PointType, number][] = [
	["pharmacy", 0.28],
	["store", 0.32],
	["kiosk", 0.14],
	["warehouse", 0.08],
	["hyper", 0.06],
	["distrib", 0.12]
];

const CAT_WEIGHTS: [Category, number][] = [
	["A", 0.18],
	["B", 0.32],
	["C", 0.34],
	["D", 0.16]
];

const BASE_TURNOVER: Record<PointType, number> = {
	pharmacy: 2.2e6,
	store: 3.6e6,
	kiosk: 0.75e6,
	warehouse: 14e6,
	hyper: 55e6,
	distrib: 28e6
};

const CAT_FACTOR: Record<Category, number> = { A: 1.6, B: 1.15, C: 0.82, D: 0.5 };

/**
 * Детерминированная генерация торговых точек (mulberry32 + Box–Muller),
 * чтобы набор был стабилен между рендерами. Порт из референс-прототипа.
 */
function buildData(count: number): TradePoint[] {
	const N = Math.max(50, Math.min(1000, count));
	let seed = 20240617;
	const rnd = () => {
		seed = (seed + 0x6d2b79f5) | 0;
		let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
	const gauss = () => {
		let u = 0;
		let v = 0;
		while (u === 0) u = rnd();
		while (v === 0) v = rnd();
		return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
	};
	const pickW = <T,>(arr: [T, number][], r: number): T => {
		let acc = 0;
		for (const it of arr) {
			acc += it[1];
			if (r <= acc) return it[0];
		}
		return arr[arr.length - 1][0];
	};

	const cwSum = CENTERS.reduce((a, c) => a + c.w, 0);
	const pts: TradePoint[] = [];
	for (let i = 0; i < N; i++) {
		let r = rnd() * cwSum;
		let acc = 0;
		let c = CENTERS[0];
		for (const cc of CENTERS) {
			acc += cc.w;
			if (r <= acc) {
				c = cc;
				break;
			}
		}
		const lat = c.la + gauss() * c.sp;
		const lng = c.lo + gauss() * c.sp * 1.6;
		const type = pickW(TYPE_WEIGHTS, rnd());
		const cat = pickW(CAT_WEIGHTS, rnd());
		const manager = rnd() < 0.12 ? null : MANAGERS[Math.floor(rnd() * MANAGERS.length)];
		const turnover = Math.round(BASE_TURNOVER[type] * CAT_FACTOR[cat] * (0.6 + rnd() * 0.9));
		const pop = Math.round(1200 + rnd() * 16000);
		pts.push({ code: "ТТ-" + (10250 + i), lat, lng, type, cat, manager, turnover, pop, district: c.n });
	}
	return pts;
}

export const TRADE_POINTS: TradePoint[] = buildData(300);
