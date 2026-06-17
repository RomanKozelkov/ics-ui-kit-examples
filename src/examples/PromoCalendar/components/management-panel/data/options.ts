import { Grouping } from "../store/panel.store";
import type { TextKey } from "../../../i18n";

// Зажать число в [min, max]. Общий примитив для года/месяцев/масштаба.
export const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

// label — ключ перевода; человекочитаемый текст резолвит потребитель через useText.
export const GROUPING_OPTIONS: { value: Grouping; labelKey: TextKey }[] = [
	{ value: "channel", labelKey: "groupField.channel" },
	{ value: "client", labelKey: "groupField.client" }
];

// Единственный источник валидных уровней группировки — выводим из опций, не дублируем список.
export const GROUPING_VALUES: readonly Grouping[] = GROUPING_OPTIONS.map((o) => o.value);

// export const SORT_OPTIONS: { value: SortBy; label: string }[] = [
// 	{ value: "startDateAsc", label: "По возрастанию даты начала" },
// 	{ value: "nameAsc", label: "По наименованию промо" }
// ];

export const DAY_WIDTH_DEFAULT = 20;

// Границы непрерывного масштаба (Slider, Ctrl+колесо/pinch).
export const DAY_WIDTH_MIN = 5;
export const DAY_WIDTH_MAX = 40;

export const clampDayWidth = (v: number) =>
	Number.isFinite(v) ? clamp(v, DAY_WIDTH_MIN, DAY_WIDTH_MAX) : DAY_WIDTH_DEFAULT;

// Type guards: onValueChange отдаёт string, а сеттеры ждут узкий union — гард вместо слепого каста.
export const isGrouping = (v: string): v is Grouping => GROUPING_OPTIONS.some((o) => o.value === v);

// export const isSortBy = (v: string): v is SortBy => SORT_OPTIONS.some((o) => o.value === v);
