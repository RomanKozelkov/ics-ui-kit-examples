import { pointInMultiPoly } from "./geo";
import { CITY_CENTER, MOSCOW, RAYONS, TERRITORY_BBOX } from "./moscowGeo";
import {
	CATEGORIES,
	NETWORK_TYPES,
	POINT_TYPES,
	POINT_TYPE_MAP,
	isHospital,
	type CategoryCode,
	type Employee,
	type NetworkType,
	type PointType,
	type TradePoint
} from "./types";

/**
 * Мок данных брикового модуля.
 *
 * Структура повторяет модель BI/MDT: справочники отдельно, объекты ссылаются на них ключами,
 * меры (mAVG offtake / mAVG turnover) лежат на торговой точке. Генерация детерминированная —
 * набор стабилен между рендерами и сборками.
 */

/* ---------- детерминированный генератор ---------- */

function makeRandom(seed: number) {
	let state = seed;
	return () => {
		state = (state + 0x6d2b79f5) | 0;
		let t = Math.imul(state ^ (state >>> 15), 1 | state);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function pickWeighted<T>(items: [T, number][], r: number): T {
	let acc = 0;
	for (const [value, weight] of items) {
		acc += weight;
		if (r <= acc) return value;
	}
	return items[items.length - 1][0];
}

/* ---------- сотрудники (строка 12) ---------- */

const ASM_NAMES = ["Соколов М.", "Орлова М.", "Лебедев К."];
const DSM_NAMES = [
	"Иванов А.",
	"Петрова Е.",
	"Смирнов Д.",
	"Кузнецова О.",
	"Попова И.",
	"Новикова Т.",
	"Морозов С.",
	"Волкова Н.",
	"Зайцев П."
];
const MR_SURNAMES = [
	"Абрамов",
	"Белова",
	"Виноградов",
	"Гусева",
	"Дорохов",
	"Ершова",
	"Жуков",
	"Зотова",
	"Исаев",
	"Киселёва",
	"Логинов",
	"Макарова",
	"Ников",
	"Осипова",
	"Панов",
	"Рыбакова",
	"Сергеев",
	"Титова",
	"Ушаков",
	"Фомина",
	"Хохлов",
	"Царёва",
	"Чернов",
	"Шилова",
	"Щукин",
	"Юдина",
	"Яковлев",
	"Андреева",
	"Борисов",
	"Власова",
	"Галкин",
	"Данилова",
	"Егоров",
	"Жданова",
	"Зимин",
	"Ильина"
];

function buildEmployees(): Employee[] {
	const list: Employee[] = [];
	ASM_NAMES.forEach((name, a) => list.push({ id: `asm-${a}`, name, role: "ASM" }));
	DSM_NAMES.forEach((name, d) =>
		list.push({ id: `dsm-${d}`, name, role: "DSM", parentId: `asm-${d % ASM_NAMES.length}` })
	);
	MR_SURNAMES.forEach((surname, m) =>
		list.push({
			id: `mr-${m}`,
			name: `${surname} ${"АБВГДЕЖЗИКЛМНОПРСТУФ"[m % 20]}.`,
			role: "MR",
			parentId: `dsm-${m % DSM_NAMES.length}`
		})
	);
	return list;
}

export const EMPLOYEES: Employee[] = buildEmployees();
export const EMPLOYEE_MAP: Record<string, Employee> = Object.fromEntries(
	EMPLOYEES.map((e) => [e.id, e])
);

const MR_IDS = EMPLOYEES.filter((e) => e.role === "MR").map((e) => e.id);

/** Цепочка MR → DSM → ASM для точки: используется в фильтрах и блоке «Сотрудники». */
export function employeeChain(mrId: string): string[] {
	const chain: string[] = [];
	let current: Employee | undefined = EMPLOYEE_MAP[mrId];
	while (current) {
		chain.push(current.id);
		current = current.parentId ? EMPLOYEE_MAP[current.parentId] : undefined;
	}
	return chain;
}

/** Медпредставитель, закреплённый за базовым районом. Брик наследует его при нарезке. */
export const RAYON_EMPLOYEE: Record<string, string> = Object.fromEntries(
	RAYONS.map((t, i) => [t.id, MR_IDS[i % MR_IDS.length]])
);

/* ---------- торговые точки ---------- */

const CHAIN_BRANDS = [
	"Ригла",
	"36,6",
	"Горздрав",
	"Апрель",
	"Планета Здоровья",
	"Неофарм",
	"Столички",
	"Будь здоров",
	"Фармленд",
	"Мелодия здоровья"
];

const LOCAL_BRANDS = ["Айболит", "Панацея", "Здоровье", "Вита", "Фармация", "Первая помощь"];

/**
 * Вес района при распределении точек: чем дальше от центра, тем реже аптеки. Благодаря
 * этому Новая Москва не получает плотность старого города, хоть и занимает больше площади.
 */
const KM_PER_DEG_LAT = 111.32;
const KM_PER_DEG_LNG = KM_PER_DEG_LAT * Math.cos((CITY_CENTER[1] * Math.PI) / 180);

const RAYON_WEIGHTS: number[] = RAYONS.map((rayon) => {
	const box = TERRITORY_BBOX[rayon.id];
	if (!box) return 0;
	const dx = ((box.minLng + box.maxLng) / 2 - CITY_CENTER[0]) * KM_PER_DEG_LNG;
	const dy = ((box.minLat + box.maxLat) / 2 - CITY_CENTER[1]) * KM_PER_DEG_LAT;
	return 1 / (1 + Math.pow(Math.hypot(dx, dy) / 6, 1.9));
});

const TYPE_WEIGHTS: [PointType, number][] = [
	["pharmacy", 0.19],
	["pharmacyKiosk", 0.09],
	["pharmacyPoint", 0.13],
	["chainPharmacy", 0.26],
	["chainPharmacyPoint", 0.17],
	["hospital", 0.07],
	["other", 0.09]
];

/** Распределение подтипов внутри группы «Больница». */
const HOSPITAL_SUBTYPE_WEIGHTS: [string, number][] = [
	["Больница - взрослая", 0.66],
	["Больница - детская", 0.34]
];

/** Распределение подтипов внутри группы «Прочие» — всё, что не аптека и не больница. */
const OTHER_SUBTYPE_WEIGHTS: [string, number][] = [
	["Поликлиника - взрослая", 0.27],
	["Поликлиника - детская", 0.13],
	["Диагностический центр - взрослый", 0.12],
	["Медицинский центр - взрослый", 0.12],
	["Оптика", 0.11],
	["Аптечный склад", 0.09],
	["Станция скорой помощи", 0.07],
	["Травмпункт", 0.05],
	["Родильный дом", 0.03],
	["Дистрибьютор", 0.01]
];

/** Привычное название вместо кода справочника — для точек с подтипом. */
const SUBTYPE_NAME: Record<string, string> = {
	"Больница - взрослая": "ГКБ",
	"Больница - детская": "Детская ГКБ",
	"Поликлиника - взрослая": "Городская поликлиника",
	"Поликлиника - детская": "Детская поликлиника",
	"Диагностический центр - взрослый": "Диагностический центр",
	"Медицинский центр - взрослый": "Медицинский центр"
};

const CATEGORY_WEIGHTS: [CategoryCode, number][] = [
	["A", 0.16],
	["B", 0.27],
	["C", 0.3],
	["D", 0.19],
	["K", 0.08]
];

const NETWORK_WEIGHTS: [NetworkType, number][] = [
	["national", 0.34],
	["regional", 0.29],
	["association", 0.22],
	["noVisits", 0.15]
];

/** Базовый mAVG offtake по типу точки, RUB. */
const BASE_OFFTAKE: Record<PointType, number> = {
	pharmacy: 210000,
	pharmacyKiosk: 85000,
	pharmacyPoint: 130000,
	chainPharmacy: 340000,
	chainPharmacyPoint: 195000,
	// У больницы наш offtake идёт через больничную аптеку — он есть, но заметно меньше сетевого.
	hospital: 95000,
	other: 60000
};

const CATEGORY_FACTOR: Record<CategoryCode, number> = { A: 1.7, B: 1.2, C: 0.85, D: 0.55, K: 0.35 };

const isChainType = (type: PointType) => type === "chainPharmacy" || type === "chainPharmacyPoint";

/** Случайная точка внутри территории: отбор в её рамке до попадания внутрь контура. */
function pointInsideTerritory(index: number, random: () => number): [number, number] | null {
	const rayon = RAYONS[index];
	const box = TERRITORY_BBOX[rayon.id];
	if (!box) return null;
	for (let attempt = 0; attempt < 60; attempt++) {
		const lng = box.minLng + random() * (box.maxLng - box.minLng);
		const lat = box.minLat + random() * (box.maxLat - box.minLat);
		if (pointInMultiPoly(lng, lat, rayon.geometry)) return [lng, lat];
	}
	return null;
}

function buildPoints(count: number): TradePoint[] {
	const random = makeRandom(20240617);
	const weightSum = RAYON_WEIGHTS.reduce((a, b) => a + b, 0);

	const points: TradePoint[] = [];
	let guard = 0;
	while (points.length < count && guard < count * 20) {
		guard++;
		// Район выбирается по весу, точка — внутри него: так каждая точка сразу чья-то.
		let r = random() * weightSum;
		let rayonIndex = 0;
		for (let i = 0; i < RAYON_WEIGHTS.length; i++) {
			r -= RAYON_WEIGHTS[i];
			if (r <= 0) {
				rayonIndex = i;
				break;
			}
		}
		const coords = pointInsideTerritory(rayonIndex, random);
		if (!coords) continue;
		const [lng, lat] = coords;

		const type = pickWeighted(TYPE_WEIGHTS, random());
		const category = pickWeighted(CATEGORY_WEIGHTS, random());
		const network = isChainType(type)
			? pickWeighted(NETWORK_WEIGHTS, random())
			: pickWeighted(
					[
						["association", 0.3],
						["noVisits", 0.45],
						["regional", 0.25]
					] as [NetworkType, number][],
					random()
				);
		const brand = isChainType(type)
			? CHAIN_BRANDS[Math.floor(random() * CHAIN_BRANDS.length)]
			: LOCAL_BRANDS[Math.floor(random() * LOCAL_BRANDS.length)];
		// У аптечных групп подтип совпадает с группой, больницы и «Прочие» разворачиваются
		// в значения исходного справочника.
		const subtype =
			type === "hospital"
				? pickWeighted(HOSPITAL_SUBTYPE_WEIGHTS, random())
				: type === "other"
					? pickWeighted(OTHER_SUBTYPE_WEIGHTS, random())
					: POINT_TYPE_MAP[type].label;
		const index = points.length;
		const offtake = Math.round(
			BASE_OFFTAKE[type] * (CATEGORY_FACTOR[category] ?? 0.6) * (0.65 + random() * 0.8)
		);
		// Наш offtake — часть общего оборота точки.
		const turnover = Math.round(offtake * (7 + random() * 16));

		points.push({
			code: `ТТ-${10250 + index}`,
			name:
				type === "hospital" || type === "other"
					? `${SUBTYPE_NAME[subtype] ?? subtype} №${1 + Math.floor(random() * 120)}`
					: isChainType(type)
						? `${brand} №${100 + Math.floor(random() * 800)}`
						: `Аптека «${brand}»`,
			lat,
			lng,
			cityId: MOSCOW.id,
			type,
			subtype,
			category,
			top50: random() < 0.42,
			network,
			// Сотрудник наследуется от базового района, в котором стоит точка.
			mrId: RAYON_EMPLOYEE[RAYONS[rayonIndex].id],
			offtake,
			turnover
		});
	}
	return points;
}

export const TRADE_POINTS: TradePoint[] = buildPoints(820);

/* ---------- больницы (строка 10) ---------- */

/**
 * Больницы — не отдельный слой объектов, а торговые точки группы «Больница» (комментарий ICS
 * к строке 10 в xlsx). Показатель «Количество больниц» считается геометрией по этому
 * подмножеству, поэтому работает и для кастомного брика.
 */
export const HOSPITALS: TradePoint[] = TRADE_POINTS.filter(isHospital);

/** Справочники для панели фильтров — в порядке отображения. */
export const DICTIONARIES = {
	pointTypes: POINT_TYPES,
	categories: CATEGORIES,
	networks: NETWORK_TYPES,
	employees: EMPLOYEES
};
