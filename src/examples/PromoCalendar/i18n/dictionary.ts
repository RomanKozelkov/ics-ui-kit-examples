import { Dictionary } from "./makeDictionary";

/**
 * Контракт переводов промо-календаря.
 *
 * Источник истины — вложенный `type` (наглядная структура). Должен быть `type`,
 * а не `interface`: type-литерал получает неявную index signature (присваивается
 * к `ITranslations`), но `keyof` сохраняет литеральные ключи. Явная index signature
 * через `extends ITranslations` схлопнула бы `keyof` в `string` → `Dictionary` = `never`.
 * Тип `TextKey` выводится рекурсивно в точечные ключи. Значения — в dictionary<lang>.ts.
 */
export type PromoCalendarTranslations = {
	calendar: {
		title: string;
		loading: string;
		error: string;
		group: string;
		allPromos: string;
	};
	groupField: {
		channel: string;
		client: string;
		brand: string;
	};
	panel: {
		year: string;
		months: string;
		monthFrom: string;
		monthTo: string;
		grouping: string;
		sort: string;
		search: string;
		searchPlaceholder: string;
		today: string;
		zoom: string;
		zoomIn: string;
		zoomOut: string;
	};
	promo: {
		name: string;
		period: string;
		brand: string;
		channel: string;
		daysShort: string;
	};
};

/** Точечные ключи из вложенного интерфейса: "calendar.title" | "panel.year" | ... */
export type TextKey = Dictionary<PromoCalendarTranslations>;
