import type { SearchSelectOption } from "ics-ui-kit/components/search-select";
import type { Grouping, SortBy } from "../types";

// Каналы — value совпадает с channelType в данных промо, label — человекочитаемый.
export const CHANNEL_OPTIONS: SearchSelectOption[] = [
	{ value: "retail", label: "Розница" },
	{ value: "distrib", label: "Дистрибуция" },
	{ value: "ecom", label: "E-com" },
	{ value: "opt", label: "Опт" },
	{ value: "horeca", label: "HoReCa" }
];

const CLIENTS = ["Магнит", "X5 Group", "Лента", "Ашан", "Перекрёсток", "Дикси", "Метро", "ВкусВилл"];

const BRANDS = ["Морозко", "Селяночка", "Фрутоныч", "Чистолюкс", "Аромаль", "Тонус", "Зелёный луг", "Барин"];

const toOptions = (values: string[]): SearchSelectOption[] => values.map((v) => ({ value: v, label: v }));

export const CLIENT_OPTIONS = toOptions(CLIENTS);

export const BRAND_OPTIONS = toOptions(BRANDS);

export const GROUPING_OPTIONS: { value: Grouping; label: string }[] = [
	{ value: "none", label: "Без группировки" },
	{ value: "channel", label: "Канал" },
	{ value: "client", label: "Клиент" },
	{ value: "brand", label: "Бренд" }
];

export const SORT_OPTIONS: { value: SortBy; label: string }[] = [
	{ value: "startDateAsc", label: "По возрастанию даты начала" },
	{ value: "nameAsc", label: "По наименованию промо" }
];

// Type guards: onValueChange отдаёт string, а сеттеры ждут узкий union — гард вместо слепого каста.
export const isGrouping = (v: string): v is Grouping => GROUPING_OPTIONS.some((o) => o.value === v);

export const isSortBy = (v: string): v is SortBy => SORT_OPTIONS.some((o) => o.value === v);
