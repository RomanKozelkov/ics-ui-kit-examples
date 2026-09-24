/**
 * Домен брикового модуля.
 *
 * Структура повторяет модель данных MDT/BI: плоские справочники (`md.*`-аналоги) с ключом
 * и названием, объекты ссылаются на справочники ключами, меры (mAVG offtake / mAVG turnover)
 * лежат на объекте. Соответствие полей реальным объектам API — в `API-REQUIREMENTS.md`.
 */

/** Элемент справочника: ключ (аналог `Code`) + отображаемое название (`Name`). */
export interface DictItem<K extends string = string> {
	key: K;
	label: string;
}

/* ---------- Тип торговой точки (строка 4, лист «Типы точек») ---------- */

export type PointType =
	| "pharmacy"
	| "pharmacyKiosk"
	| "pharmacyPoint"
	| "chainPharmacy"
	| "chainPharmacyPoint"
	| "hospital"
	| "other";

export interface PointTypeMeta extends DictItem<PointType> {
	color: string;
	/** Внутренние пути SVG-иконки (24×24). */
	icon: string;
}

const ICON_CROSS = '<line x1="12" y1="6" x2="12" y2="18"/><line x1="6" y1="12" x2="18" y2="12"/>';
const ICON_KIOSK =
	'<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M2 7h20"/>';
const ICON_POINT =
	'<path d="M12 21a9 9 0 1 0-9-9"/><path d="M12 7v5l3 2"/><path d="m3 12 3 3 3-3"/>';
const ICON_CHAIN =
	'<path d="M9 17H7a5 5 0 0 1 0-10h2"/><path d="M15 7h2a5 5 0 0 1 0 10h-2"/><line x1="8" y1="12" x2="16" y2="12"/>';
const ICON_CHAIN_POINT =
	'<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>';
const ICON_HOSPITAL =
	'<path d="M3 21h18"/><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/><path d="M12 7v6"/><path d="M9 10h6"/>';
const ICON_OTHER = '<circle cx="12" cy="12" r="3"/><path d="M12 5v1"/><path d="M12 18v1"/><path d="M5 12h1"/><path d="M18 12h1"/>';

/**
 * Целевая группировка типов точек (треб. 6.1).
 *
 * «Больница» — седьмая группа сверх пяти аптечных и «Прочих» из требований: больницы нужны
 * отдельным показателем территории (строка 10), и держать их внутри «Прочих» вместе со
 * складами и оптикой значит не давать их ни отфильтровать, ни увидеть в составе по типам.
 * В исходном справочнике это подтипы «Больница — взрослая / детская» (лист «Типы точек»).
 */
export const POINT_TYPES: PointTypeMeta[] = [
	{ key: "pharmacy", label: "Аптека", color: "#1f9d57", icon: ICON_CROSS },
	{ key: "pharmacyKiosk", label: "Аптечный киоск", color: "#db2777", icon: ICON_KIOSK },
	{ key: "pharmacyPoint", label: "Аптечный пункт", color: "#d97706", icon: ICON_POINT },
	{ key: "chainPharmacy", label: "Сетевая аптека", color: "#2563eb", icon: ICON_CHAIN },
	{ key: "chainPharmacyPoint", label: "Сетевой аптечный пункт", color: "#7c3aed", icon: ICON_CHAIN_POINT },
	{ key: "hospital", label: "Больница", color: "#0891b2", icon: ICON_HOSPITAL },
	{ key: "other", label: "Прочие", color: "#64748b", icon: ICON_OTHER }
];

export const POINT_TYPE_MAP: Record<PointType, PointTypeMeta> = Object.fromEntries(
	POINT_TYPES.map((t) => [t.key, t])
) as Record<PointType, PointTypeMeta>;

/**
 * Подтипы из исходного справочника (лист «Типы точек»), которые сворачиваются в «Прочие».
 * Целевая группа нужна для фильтров и раскраски, подтип — для карточки точки: в источнике
 * поликлиника отличается от склада или оптики только этим значением.
 */
export const OTHER_SUBTYPES: string[] = [
	"Поликлиника - взрослая",
	"Поликлиника - детская",
	"Диагностический центр - взрослый",
	"Аптечный склад",
	"Дистрибьютор",
	"Медицинский центр - взрослый",
	"Оптика",
	"Родильный дом",
	"Станция скорой помощи",
	"Травмпункт"
];

/**
 * Подтипы справочника, которые попадают в группу «Больница» и считаются в показателе
 * «Количество больниц» (строка 10).
 *
 * По комментарию ICS в xlsx больницы — не отдельный слой объектов, а те же торговые точки,
 * поэтому показатель считается по общему набору точек.
 */
export const HOSPITAL_SUBTYPES: string[] = ["Больница - взрослая", "Больница - детская"];

export const isHospital = (point: TradePoint): boolean => point.type === "hospital";

/* ---------- Категория торговой точки (строка 7) ---------- */

/** Список открытый — в данных встречаются A, B, C, D, K и другие значения. */
export type CategoryCode = string;

export const CATEGORIES: CategoryCode[] = ["A", "B", "C", "D", "K"];

const CAT_COLOR_MAP: Record<string, string> = {
	A: "#1f9d57",
	B: "#2563eb",
	C: "#d97706",
	D: "#64748b",
	K: "#7c3aed"
};

/** Цвет категории; для значения вне известного списка — нейтральный. */
export const catColor = (code: CategoryCode) => CAT_COLOR_MAP[code] ?? "#94a3b8";

/* ---------- Топ точки (строка 8) ---------- */

/**
 * В требованиях поле называется «ТОП-50 %», но по итогам показа прототипа переименовано
 * в «Топ точки»: смысл признака у заказчика шире доли в 50 %. Ключи оставлены прежними.
 */
export const TOP_LABEL = "Топ точки";

export type Top50Key = "top" | "rest";

export const TOP50_VALUES: DictItem<Top50Key>[] = [
	{ key: "top", label: "Топ" },
	{ key: "rest", label: "Не топ" }
];

/* ---------- Тип сети точки (строка 9) ---------- */

export type NetworkType = "association" | "national" | "regional" | "noVisits";

export const NETWORK_TYPES: DictItem<NetworkType>[] = [
	{ key: "association", label: "Ассоциация" },
	{ key: "national", label: "Национальная сеть" },
	{ key: "regional", label: "Региональная сеть" },
	{ key: "noVisits", label: "Сеть без визитов" }
];

/* ---------- Сотрудники (строка 12) ---------- */

/** Уровень в иерархии: ASM → DSM → MR. */
export type EmployeeRole = "ASM" | "DSM" | "MR";

export const EMPLOYEE_ROLES: EmployeeRole[] = ["MR", "DSM", "ASM"];

export interface Employee {
	id: string;
	name: string;
	role: EmployeeRole;
	/** Руководитель: у MR — DSM, у DSM — ASM, у ASM — отсутствует. */
	parentId?: string;
}

/* ---------- Город (треб. 3.1.1) ---------- */

export interface City {
	id: string;
	name: string;
}

/* ---------- Торговая точка ---------- */

export interface TradePoint {
	/** Код торговой точки. */
	code: string;
	/** Наименование торговой точки (строка 3). */
	name: string;
	lat: number;
	lng: number;
	cityId: string;
	/** Тип торговой точки — целевая группа (строка 4). */
	type: PointType;
	/** Подтип из исходного справочника; для аптечных групп совпадает с названием группы. */
	subtype: string;
	/** Категория торговой точки (строка 7). */
	category: CategoryCode;
	/** Топ / не топ точка (строка 8, в требованиях — «ТОП-50 %»). */
	top50: boolean;
	/** Тип сети точки (строка 9). */
	network: NetworkType;
	/** Медицинский представитель (строка 12); DSM и ASM выводятся по иерархии. */
	mrId: string;
	/** mAVG offtake, RUB (строка 13). */
	offtake: number;
	/** mAVG turnover, RUB (строка 14). */
	turnover: number;
}

/* ---------- Территории ---------- */

/** Округ, район и кастомный брик равноправны как выбранная территория (треб. 2.6). */
export type TerritoryKind = "okrug" | "rayon" | "brick";

export const TERRITORY_KIND_LABEL: Record<TerritoryKind, string> = {
	okrug: "Округ",
	rayon: "Район",
	brick: "Брик"
};

/** Пара координат в порядке GeoJSON: [lng, lat]. */
export type Pair = [number, number];
/** Замкнутый контур. */
export type Ring = Pair[];
/** Полигон: внешний контур и, при наличии, отверстия. */
export type Poly = Ring[];
/** Мультиполигон — базовая форма хранения геометрии территории. */
export type MultiPoly = Poly[];

export interface Territory {
	id: string;
	kind: TerritoryKind;
	name: string;
	cityId: string;
	/** Исходная геометрия. Отображаемая («эффективная») считается за вычетом бриков. */
	geometry: MultiPoly;
	/** Район → округ; брик → территория, из которой он нарезан. */
	parentId?: string;
	/** Сотрудник, закреплённый за территорией (для бриков; треб. 3.6). */
	employeeId?: string;
}

/* ---------- Метрика раскраски (треб. 7.1) ---------- */

export type ColorMetric = "count" | "offtake" | "turnover";

export const COLOR_METRICS: DictItem<ColorMetric>[] = [
	{ key: "count", label: "Количество точек" },
	{ key: "offtake", label: "mAVG offtake" },
	{ key: "turnover", label: "mAVG turnover" }
];
