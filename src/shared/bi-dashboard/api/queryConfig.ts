/** Времена устаревания кэша react-query для BI-дашбордов. */
export const STALE_TIMES = {
	/** Справочники (опции фильтров) — редко меняются, можно кэшировать. */
	dictionaries: 5 * 60 * 1000
} as const;
