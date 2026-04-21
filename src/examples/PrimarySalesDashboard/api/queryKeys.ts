import type { FiltersState } from "../stores/useFiltersStore";

type CardsKeyInput = Pick<FiltersState, "year" | "sourceType" | "bindType" | "period">;

type TableKeyInput = Pick<
	FiltersState,
	"year" | "metric" | "currency" | "sourceType" | "bindType" | "period" | "counterparties" | "brands"
>;

const sortIds = (opts: FiltersState["counterparties"]) => [...opts].map((o) => o.value).sort();

export const primarySalesKeys = {
	all: ["primarySales"] as const,
	cards: (f: CardsKeyInput) =>
		[
			"primarySales",
			"cards",
			{
				year: f.year,
				sourceType: f.sourceType,
				bindType: f.bindType,
				period: f.period
			}
		] as const,
	distributorsTable: (f: TableKeyInput) =>
		[
			"primarySales",
			"table",
			"distributors",
			{
				year: f.year,
				metric: f.metric,
				currency: f.currency,
				sourceType: f.sourceType,
				bindType: f.bindType,
				period: f.period,
				brands: sortIds(f.brands)
			}
		] as const,
	brandsTable: (f: TableKeyInput) =>
		[
			"primarySales",
			"table",
			"brands",
			{
				year: f.year,
				metric: f.metric,
				currency: f.currency,
				sourceType: f.sourceType,
				bindType: f.bindType,
				period: f.period,
				counterparties: sortIds(f.counterparties)
			}
		] as const,

	trend: (f: TableKeyInput) =>
		[
			"primarySales",
			"trend",
			{
				year: f.year,
				metric: f.metric,
				currency: f.currency,
				sourceType: f.sourceType,
				bindType: f.bindType,
				period: f.period,
				counterparties: sortIds(f.counterparties),
				brands: sortIds(f.brands)
			}
		] as const,
	// #region === READY FOR USE ===
	distributors: (search: string) => ["primarySales", "filters", "distributors", search.trim().toLowerCase()] as const,
	brands: (search: string) => ["primarySales", "options", "brands", search.trim().toLowerCase()] as const
	// #endregion
};
