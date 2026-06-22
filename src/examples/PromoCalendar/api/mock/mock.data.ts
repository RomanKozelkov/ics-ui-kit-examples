/**
 * Сырое представление промо внутри mock: даты — Date (нужны для date-математики:
 * фильтр по диапазону года, clamp). Наружу порт отдаёт ISO ({@link RawPromo}) —
 * конвертация на границе fetchPromoCalendar (см. mock.api).
 */
export interface RawPromo {
	id: number;
	title: string;
	dateBegin: Date;
	dateEnd: Date;
	channelName: string;
	companyName: string;
}

// ─── Справочники ─────────────────────────────────────────────────────────────

const CHANNELS = ["retail", "distrib", "ecom", "opt", "horeca"];

const CHANNEL_WEIGHTS = [34, 20, 18, 16, 12];

const CLIENTS = ["Магнит", "X5 Group", "Лента", "Ашан", "Перекрёсток", "Дикси", "Метро", "ВкусВилл"];

const TITLES = [
	"Жёлтый ценник",
	"Скидка 20%",
	"Каждый день низкие цены",
	"Подарок за покупку",
	"−30% на вторую",
	"Купи 2 — получи 3",
	"Спецвыкладка",
	"Полка в торце",
	"Промо-остров",
	"Дегустация",
	"Сезон распродаж",
	"Чёрная пятница",
	"Новогодний промо",
	"Летний кэшбэк",
	"Школьный базар",
	"Большая стирка",
	"Неделя свежести",
	"Фестиваль вкуса",
	"Гипер-цена",
	"Два по цене одного"
];

// ─── PRNG (mulberry32) ────────────────────────────────────────────────────────

function mulberry32(seed: number) {
	let a = seed;
	return () => {
		a |= 0;
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

// ─── Вспомогательные функции ──────────────────────────────────────────────────

function weightedPick<T>(rnd: () => number, arr: T[], weights: number[]): T {
	const total = weights.reduce((a, b) => a + b, 0);
	let r = rnd() * total;
	for (let i = 0; i < arr.length; i++) {
		r -= weights[i];
		if (r <= 0) return arr[i];
	}
	return arr[arr.length - 1];
}

function pick<T>(rnd: () => number, arr: T[]): T {
	return arr[Math.floor(rnd() * arr.length)];
}

function toDateObj(ms: number): Date {
	return new Date(ms);
}

function addDays(ms: number, days: number): number {
	return ms + days * 86400000;
}

function pickDuration(rnd: () => number): number {
	const bucket = weightedPick(rnd, ["s", "m", "l", "x"] as const, [22, 44, 24, 10]);
	if (bucket === "s") return 3 + Math.floor(rnd() * 5); // 3–7
	if (bucket === "m") return 8 + Math.floor(rnd() * 16); // 8–23
	if (bucket === "l") return 24 + Math.floor(rnd() * 45); // 24–68
	return 70 + Math.floor(rnd() * 80); // 70–149
}

const WINDOW_START = Date.UTC(2024, 0, 1);
const WINDOW_END = Date.UTC(2026, 11, 31);
const WINDOW_DAYS = Math.round((WINDOW_END - WINDOW_START) / 86400000);

function buildItem(rnd: () => number, id: number): RawPromo {
	const startMs = addDays(WINDOW_START, Math.floor(rnd() * WINDOW_DAYS));
	const endMs = addDays(startMs, pickDuration(rnd));

	return {
		id,
		title: pick(rnd, TITLES),
		dateBegin: toDateObj(startMs),
		dateEnd: toDateObj(endMs),
		channelName: weightedPick(rnd, CHANNELS, CHANNEL_WEIGHTS),
		companyName: pick(rnd, CLIENTS)
	};
}

// ─── Якорные записи (вручную) ─────────────────────────────────────────────────
// Гарантируют интересные случаи: переход через год, длинные, перекрывающиеся.

const ANCHORS: RawPromo[] = [
	{
		id: 1,
		title: "Новогодний промо",
		dateBegin: new Date(2024, 11, 15),
		dateEnd: new Date(2025, 1, 10),
		channelName: "retail",
		companyName: "Магнит"
	},
	{
		id: 2,
		title: "Новогодний промо",
		dateBegin: new Date(2025, 10, 20),
		dateEnd: new Date(2026, 0, 25),
		channelName: "retail",
		companyName: "X5 Group"
	},
	{
		id: 3,
		title: "Каждый день низкие цены",
		dateBegin: new Date(2025, 0, 10),
		dateEnd: new Date(2025, 11, 20),
		channelName: "distrib",
		companyName: "Лента"
	},
	{
		id: 4,
		title: "Скидка 20%",
		dateBegin: new Date(2025, 2, 3),
		dateEnd: new Date(2025, 3, 14),
		channelName: "retail",
		companyName: "Магнит"
	},
	{
		id: 5,
		title: "−30% на вторую",
		dateBegin: new Date(2025, 2, 20),
		dateEnd: new Date(2025, 4, 5),
		channelName: "retail",
		companyName: "Магнит"
	},
	{
		id: 6,
		title: "Спецвыкладка",
		dateBegin: new Date(2025, 2, 25),
		dateEnd: new Date(2025, 3, 30),
		channelName: "retail",
		companyName: "Магнит"
	},
	{
		id: 7,
		title: "Летний кэшбэк",
		dateBegin: new Date(2025, 5, 1),
		dateEnd: new Date(2025, 7, 31),
		channelName: "ecom",
		companyName: "ВкусВилл"
	},
	{
		id: 8,
		title: "Чёрная пятница",
		dateBegin: new Date(2025, 10, 24),
		dateEnd: new Date(2025, 10, 30),
		channelName: "ecom",
		companyName: "ВкусВилл"
	},
	{
		id: 9,
		title: "Школьный базар",
		dateBegin: new Date(2025, 7, 10),
		dateEnd: new Date(2025, 8, 15),
		channelName: "retail",
		companyName: "Перекрёсток"
	},
	{
		id: 10,
		title: "Дегустация",
		dateBegin: new Date(2025, 4, 1),
		dateEnd: new Date(2025, 4, 14),
		channelName: "horeca",
		companyName: "Метро"
	}
];

/*
 * Всегда возвращает одни и те же данные.
 */
export function getStaticPromos(extend: number = 200): RawPromo[] {
	const rnd = mulberry32(0xc0ffee);
	const generated: RawPromo[] = [];
	for (let i = ANCHORS.length + 1; i <= ANCHORS.length + extend; i++) {
		generated.push(buildItem(rnd, i));
	}
	return [...ANCHORS, ...generated];
}

let cache: RawPromo[] | null = null;
export function getStaticWithCache(): RawPromo[] {
	if (cache) return cache;
	cache = getStaticPromos();
	return cache;
}

/**
 * Генерирует N случайных записей (seed = Date.now()).
 */
export function generatePromos(count: number): RawPromo[] {
	const rnd = mulberry32(Date.now());
	return Array.from({ length: count }, (_, i) => buildItem(rnd, i + 1));
}
