import type { FiltersState } from "../stores/useFiltersStore";

/**
 * Срезы фильтров запроса — единый источник для ключей кэша (`queryKeys`) и фетчеров.
 * Что уходит в ключ, то же используется при запросе, поэтому тип описан один раз здесь.
 */

/** Базовые поля области запроса (без опций-справочников). */
export type BaseScope = Pick<FiltersState, "year" | "sourceType" | "bindType" | "period">;

/** База + выбранные контрагенты. */
export type CounterpartyScope = BaseScope & Pick<FiltersState, "counterparties">;

/** База + выбранные бренды. */
export type BrandScope = BaseScope & Pick<FiltersState, "brands">;

/** База + контрагенты + бренды. */
export type CounterpartyBrandScope = BaseScope & Pick<FiltersState, "counterparties" | "brands">;
