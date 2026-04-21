export const STALE_TIMES = {
	dictionaries: 5 * 60 * 1000 // справочники — редко меняются, можно кэшировать
} as const;
