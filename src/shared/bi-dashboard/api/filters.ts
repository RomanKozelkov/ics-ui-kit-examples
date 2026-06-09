import type { TabularColumnRef, TabularFilter } from "../../api";

/** Фильтр `eq` по колонке схемы. */
export const eqFilter = (col: TabularColumnRef, value: string): TabularFilter => ({
	op: "eq",
	column: col.column,
	value
});

/** Фильтр `in` по списку значений опций для колонки схемы. */
export const inFilter = (col: TabularColumnRef, values: string[]): TabularFilter => ({
	op: "in",
	column: col.column,
	list: values
});
