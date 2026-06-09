import type { FiltersState } from "../stores/useFiltersStore";

/**
 * Срез фильтров запроса — единый источник для ключей кэша (`queryKeys`) и фетчеров.
 * Что уходит в ключ, то же используется при запросе, поэтому тип описан один раз здесь.
 *
 * Все запросы Offtake используют полный набор фильтров (клиенты/контракты/каналы/бренды),
 * поэтому срез один.
 */
export type Scope = Pick<
	FiltersState,
	"year" | "sourceType" | "bindType" | "period" | "counterparties" | "contracts" | "salesChannels" | "brands"
>;
