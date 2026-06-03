import type { FiltersState } from "../stores/useFiltersStore";

//TODO: Объединить типы в keys, в fetchers, в store
type CardsKeyInput = Pick<FiltersState, "year" | "sourceType" | "bindType" | "period">;

type TableKeyInput = Pick<
	FiltersState,
	"year" | "metric" | "sourceType" | "bindType" | "period" | "counterparties" | "brands"
>;

type TopDistrKeyInput = Pick<FiltersState, "year" | "sourceType" | "bindType" | "period">;
type TopRegionsKeyInput = Pick<
	FiltersState,
	"year" | "sourceType" | "bindType" | "period" | "counterparties" | "brands"
>;
type TopBrandsKeyInput = Pick<FiltersState, "year" | "sourceType" | "bindType" | "period" | "counterparties">;

const sortIds = (opts: FiltersState["counterparties"]) => [...opts].map((o) => o.value).sort();

export const secondarySalesKeys = {
	distributors: (search: string) => ["secondarySales", "filters", "distributors", search.trim().toLowerCase()] as const,
	brands: (search: string) => ["secondarySales", "filters", "brands", search.trim().toLowerCase()] as const,
	cards: (f: CardsKeyInput) => ["secondarySales", "cards", { ...f }] as const,
	topDistributorsData: (f: TopDistrKeyInput) => ["secondarySales", "grids", "topDistributors", { ...f }] as const,
	topRegionsData: (f: TopRegionsKeyInput) =>
		[
			"secondarySales",
			"grids",
			"topRegions",
			{
				year: f.year,
				sourceType: f.sourceType,
				bindType: f.bindType,
				period: f.period,
				counterparties: sortIds(f.counterparties),
				brands: sortIds(f.brands)
			}
		] as const,
	topBrandsData: (f: TopBrandsKeyInput) =>
		["secondarySales", "brands", { ...f, counterparties: sortIds(f.counterparties) }] as const,

	//////////////////
	distributorsTable: (f: TableKeyInput) =>
		[
			"secondarySales",
			"table",
			"distributors",
			{
				year: f.year,
				metric: f.metric,
				sourceType: f.sourceType,
				bindType: f.bindType,
				period: f.period,
				brands: sortIds(f.brands)
			}
		] as const,
	brandsTable: (f: TableKeyInput) =>
		[
			"secondarySales",
			"table",
			"brands",
			{
				year: f.year,
				metric: f.metric,
				sourceType: f.sourceType,
				bindType: f.bindType,
				period: f.period,
				counterparties: sortIds(f.counterparties)
			}
		] as const,

	trend: (f: TableKeyInput) =>
		[
			"secondarySales",
			"trend",
			{
				year: f.year,
				metric: f.metric,
				sourceType: f.sourceType,
				bindType: f.bindType,
				period: f.period,
				counterparties: sortIds(f.counterparties),
				brands: sortIds(f.brands)
			}
		] as const,
	distributorsByBrandData: (f: CardsKeyInput & Pick<FiltersState, "brands">) =>
		[
			"secondarySales",
			"driversDistributors",
			{
				year: f.year,
				sourceType: f.sourceType,
				bindType: f.bindType,
				period: f.period,
				brands: sortIds(f.brands)
			}
		] as const,
	regionsByBrandData: (f: CardsKeyInput & Pick<FiltersState, "counterparties" | "brands">) =>
		[
			"secondarySales",
			"driversRegions",
			{
				year: f.year,
				sourceType: f.sourceType,
				bindType: f.bindType,
				period: f.period,
				counterparties: sortIds(f.counterparties),
				brands: sortIds(f.brands)
			}
		] as const,
	trendData: (f: CardsKeyInput & Pick<FiltersState, "counterparties" | "brands">) =>
		[
			"secondarySales",
			"trendData",
			{
				year: f.year,
				sourceType: f.sourceType,
				bindType: f.bindType,
				period: f.period,
				counterparties: sortIds(f.counterparties),
				brands: sortIds(f.brands)
			}
		] as const
};
