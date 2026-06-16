import type { SearchSelectOption } from "ics-ui-kit/components/search-select";
import { Grouping } from "../store/panel.store";

// Каналы — value совпадает с channelType в данных промо, label — человекочитаемый.
export const CHANNEL_OPTIONS: SearchSelectOption[] = [
	{ value: "retail", label: "Розница" },
	{ value: "distrib", label: "Дистрибуция" },
	{ value: "ecom", label: "E-com" },
	{ value: "opt", label: "Опт" },
	{ value: "horeca", label: "HoReCa" }
];

export const GROUPING_OPTIONS: { value: Grouping; label: string }[] = [
	{ value: "none", label: "Без группировки" },
	{ value: "channel", label: "Канал" },
	{ value: "client", label: "Клиент" },
	{ value: "brand", label: "Бренд" }
];

// export const SORT_OPTIONS: { value: SortBy; label: string }[] = [
// 	{ value: "startDateAsc", label: "По возрастанию даты начала" },
// 	{ value: "nameAsc", label: "По наименованию промо" }
// ];

// Масштаб таймлайна: ширина одного дня в px. value >= 18 (DAY_NUMBER_MIN_PX) показывает числа дней.
// i18nKey разрешается через text() в момент рендера контрола.
export const DAY_WIDTH_PRESETS: { value: number; i18nKey: "panel.zoomCompact" | "panel.zoomMedium" | "panel.zoomDetailed" }[] = [
	{ value: 10, i18nKey: "panel.zoomCompact" },
	{ value: 20, i18nKey: "panel.zoomMedium" },
	{ value: 36, i18nKey: "panel.zoomDetailed" }
];

export const DAY_WIDTH_DEFAULT = 20;

// Type guards: onValueChange отдаёт string, а сеттеры ждут узкий union — гард вместо слепого каста.
export const isGrouping = (v: string): v is Grouping => GROUPING_OPTIONS.some((o) => o.value === v);

export const isDayWidth = (v: unknown): v is number =>
	typeof v === "number" && DAY_WIDTH_PRESETS.some((o) => o.value === v);

// export const isSortBy = (v: string): v is SortBy => SORT_OPTIONS.some((o) => o.value === v);
