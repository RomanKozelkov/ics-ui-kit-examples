import { PromoCalendarItem } from "./pormo.types";

// ─── Справочники ─────────────────────────────────────────────────────────────

const CHANNELS = ["retail", "distrib", "ecom", "opt", "horeca"];

const CHANNEL_WEIGHTS = [34, 20, 18, 16, 12];

const CLIENTS = ["Магнит", "X5 Group", "Лента", "Ашан", "Перекрёсток", "Дикси", "Метро", "ВкусВилл"];

const BRANDS = ["Морозко", "Селяночка", "Фрутоныч", "Чистолюкс", "Аромаль", "Тонус", "Зелёный луг", "Барин"];

const SKU_BY_BRAND: { [key: string]: string[] } = {
	Морозко: ["Пельмени 800 г", "Вареники 450 г", "Блинчики 360 г"],
	Селяночка: ["Сметана 20% 300 г", "Творог 5% 200 г", "Масло 82% 180 г"],
	Фрутоныч: ["Сок яблочный 1 л", "Нектар мультифрукт 0,95 л", "Морс клюква 1 л"],
	Чистолюкс: ["Гель для посуды 500 мл", "Порошок 3 кг", "Кондиционер 1 л"],
	Аромаль: ["Шампунь 400 мл", "Гель для душа 250 мл", "Мыло 4×90 г"],
	Тонус: ["Энергетик 0,45 л", "Изотоник 0,5 л", "Вода 1,5 л"],
	"Зелёный луг": ["Чай чёрный 100 пак.", "Кофе молотый 250 г", "Какао 200 г"],
	Барин: ["Колбаса в/к 350 г", "Сосиски 480 г", "Бекон 200 г"]
};

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

function buildItem(rnd: () => number, id: number): PromoCalendarItem {
	const brand = pick(rnd, BRANDS);
	const skus = SKU_BY_BRAND[brand];
	const startMs = addDays(WINDOW_START, Math.floor(rnd() * WINDOW_DAYS));
	const endMs = addDays(startMs, pickDuration(rnd));

	return {
		id,
		title: pick(rnd, TITLES),
		dateBegin: toDateObj(startMs),
		dateEnd: toDateObj(endMs),
		channelType: weightedPick(rnd, CHANNELS, CHANNEL_WEIGHTS),
		companyName: pick(rnd, CLIENTS),
		brandName: brand,
		skuName: brand + " · " + pick(rnd, skus)
	};
}

// ─── Якорные записи (вручную) ─────────────────────────────────────────────────
// Гарантируют интересные случаи: переход через год, длинные, перекрывающиеся.

const ANCHORS: PromoCalendarItem[] = [
	{
		id: 1,
		title: "Новогодний промо",
		dateBegin: new Date(2024, 11, 15),
		dateEnd: new Date(2025, 1, 10),
		channelType: "retail",
		companyName: "Магнит",
		brandName: "Морозко",
		skuName: "Морозко · Пельмени 800 г"
	},
	{
		id: 2,
		title: "Новогодний промо",
		dateBegin: new Date(2025, 10, 20),
		dateEnd: new Date(2026, 0, 25),
		channelType: "retail",
		companyName: "X5 Group",
		brandName: "Селяночка",
		skuName: "Селяночка · Масло 82% 180 г"
	},
	{
		id: 3,
		title: "Каждый день низкие цены",
		dateBegin: new Date(2025, 0, 10),
		dateEnd: new Date(2025, 11, 20),
		channelType: "distrib",
		companyName: "Лента",
		brandName: "Чистолюкс",
		skuName: "Чистолюкс · Порошок 3 кг"
	},
	{
		id: 4,
		title: "Скидка 20%",
		dateBegin: new Date(2025, 2, 3),
		dateEnd: new Date(2025, 3, 14),
		channelType: "retail",
		companyName: "Магнит",
		brandName: "Фрутоныч",
		skuName: "Фрутоныч · Сок яблочный 1 л"
	},
	{
		id: 5,
		title: "−30% на вторую",
		dateBegin: new Date(2025, 2, 20),
		dateEnd: new Date(2025, 4, 5),
		channelType: "retail",
		companyName: "Магнит",
		brandName: "Тонус",
		skuName: "Тонус · Энергетик 0,45 л"
	},
	{
		id: 6,
		title: "Спецвыкладка",
		dateBegin: new Date(2025, 2, 25),
		dateEnd: new Date(2025, 3, 30),
		channelType: "retail",
		companyName: "Магнит",
		brandName: "Барин",
		skuName: "Барин · Сосиски 480 г"
	},
	{
		id: 7,
		title: "Летний кэшбэк",
		dateBegin: new Date(2025, 5, 1),
		dateEnd: new Date(2025, 7, 31),
		channelType: "ecom",
		companyName: "ВкусВилл",
		brandName: "Аромаль",
		skuName: "Аромаль · Гель для душа 250 мл"
	},
	{
		id: 8,
		title: "Чёрная пятница",
		dateBegin: new Date(2025, 10, 24),
		dateEnd: new Date(2025, 10, 30),
		channelType: "ecom",
		companyName: "ВкусВилл",
		brandName: "Зелёный луг",
		skuName: "Зелёный луг · Кофе молотый 250 г"
	},
	{
		id: 9,
		title: "Школьный базар",
		dateBegin: new Date(2025, 7, 10),
		dateEnd: new Date(2025, 8, 15),
		channelType: "retail",
		companyName: "Перекрёсток",
		brandName: "Фрутоныч",
		skuName: "Фрутоныч · Морс клюква 1 л"
	},
	{
		id: 10,
		title: "Дегустация",
		dateBegin: new Date(2025, 4, 1),
		dateEnd: new Date(2025, 4, 14),
		channelType: "horeca",
		companyName: "Метро",
		brandName: "Барин",
		skuName: "Барин · Колбаса в/к 350 г"
	}
];

// ─── Экспортируемые функции ───────────────────────────────────────────────────

/**
 * 100 детерминированных записей (фиксированный seed).
 * Всегда возвращает одни и те же данные.
 */
export function getStaticPromos(): PromoCalendarItem[] {
	const rnd = mulberry32(0xc0ffee);
	const generated: PromoCalendarItem[] = [];
	for (let i = ANCHORS.length + 1; i <= 100; i++) {
		generated.push(buildItem(rnd, i));
	}
	return [...ANCHORS, ...generated];
}

/**
 * Генерирует N случайных записей (seed = Date.now()).
 */
export function generatePromos(count: number): PromoCalendarItem[] {
	const rnd = mulberry32(Date.now());
	return Array.from({ length: count }, (_, i) => buildItem(rnd, i + 1));
}
