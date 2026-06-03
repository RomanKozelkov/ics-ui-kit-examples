import type { FiltersState } from "../stores/useFiltersStore";

//TODO: Объединить типы в keys, в fetchers, в store
type CardsKeyInput = Pick<
	FiltersState,
	"year" | "sourceType" | "bindType" | "period" | "counterparties" | "contracts" | "salesChannels" | "brands"
>;

type TableKeyInput = Pick<
	FiltersState,
	"year" | "metric" | "sourceType" | "bindType" | "period" | "counterparties" | "contracts" | "salesChannels" | "brands"
>;

type TopDistrKeyInput = Pick<
	FiltersState,
	"year" | "sourceType" | "bindType" | "period" | "counterparties" | "contracts" | "salesChannels" | "brands"
>;
type TopRegionsKeyInput = Pick<
	FiltersState,
	"year" | "sourceType" | "bindType" | "period" | "counterparties" | "contracts" | "salesChannels" | "brands"
>;
type TopBrandsKeyInput = Pick<
	FiltersState,
	"year" | "sourceType" | "bindType" | "period" | "counterparties" | "contracts" | "salesChannels" | "brands"
>;

const sortIds = (opts: FiltersState["counterparties"]) => [...opts].map((o) => o.value).sort();

export const offtakeKeys = {
	distributors: (search: string) => ["offtake", "filters", "distributors", search.trim().toLowerCase()] as const,
	contracts: (search: string) => ["offtake", "filters", "contracts", search.trim().toLowerCase()] as const,
	salesChannels: (search: string) => ["offtake", "filters", "salesChannels", search.trim().toLowerCase()] as const,
	brands: (search: string) => ["offtake", "filters", "brands", search.trim().toLowerCase()] as const,
	cards: (f: CardsKeyInput) =>
		[
			"offtake",
			"cards",
			{
				year: f.year,
				sourceType: f.sourceType,
				bindType: f.bindType,
				period: f.period,
				counterparties: sortIds(f.counterparties),
				contracts: sortIds(f.contracts),
				salesChannels: sortIds(f.salesChannels),
				brands: sortIds(f.brands)
			}
		] as const,
	topDistributorsData: (f: TopDistrKeyInput) =>
		[
			"offtake",
			"grids",
			"topDistributors",
			{
				year: f.year,
				sourceType: f.sourceType,
				bindType: f.bindType,
				period: f.period,
				counterparties: sortIds(f.counterparties),
				contracts: sortIds(f.contracts),
				salesChannels: sortIds(f.salesChannels),
				brands: sortIds(f.brands)
			}
		] as const,
	topRegionsData: (f: TopRegionsKeyInput) =>
		[
			"offtake",
			"grids",
			"topRegions",
			{
				year: f.year,
				sourceType: f.sourceType,
				bindType: f.bindType,
				period: f.period,
				counterparties: sortIds(f.counterparties),
				contracts: sortIds(f.contracts),
				salesChannels: sortIds(f.salesChannels),
				brands: sortIds(f.brands)
			}
		] as const,
	topBrandsData: (f: TopBrandsKeyInput) =>
		[
			"offtake",
			"brands",
			{
				year: f.year,
				sourceType: f.sourceType,
				bindType: f.bindType,
				period: f.period,
				counterparties: sortIds(f.counterparties),
				contracts: sortIds(f.contracts),
				salesChannels: sortIds(f.salesChannels),
				brands: sortIds(f.brands)
			}
		] as const,

	//////////////////
	distributorsTable: (f: TableKeyInput) =>
		[
			"offtake",
			"table",
			"distributors",
			{
				year: f.year,
				metric: f.metric,
				sourceType: f.sourceType,
				bindType: f.bindType,
				period: f.period,
				contracts: sortIds(f.contracts),
				salesChannels: sortIds(f.salesChannels),
				brands: sortIds(f.brands)
			}
		] as const,
	brandsTable: (f: TableKeyInput) =>
		[
			"offtake",
			"table",
			"brands",
			{
				year: f.year,
				metric: f.metric,
				sourceType: f.sourceType,
				bindType: f.bindType,
				period: f.period,
				counterparties: sortIds(f.counterparties),
				contracts: sortIds(f.contracts),
				salesChannels: sortIds(f.salesChannels),
				brands: sortIds(f.brands)
			}
		] as const,

	trend: (f: TableKeyInput) =>
		[
			"offtake",
			"trend",
			{
				year: f.year,
				metric: f.metric,
				sourceType: f.sourceType,
				bindType: f.bindType,
				period: f.period,
				counterparties: sortIds(f.counterparties),
				contracts: sortIds(f.contracts),
				salesChannels: sortIds(f.salesChannels),
				brands: sortIds(f.brands)
			}
		] as const,
	distributorsByBrandData: (f: CardsKeyInput) =>
		[
			"offtake",
			"driversDistributors",
			{
				year: f.year,
				sourceType: f.sourceType,
				bindType: f.bindType,
				period: f.period,
				counterparties: sortIds(f.counterparties),
				contracts: sortIds(f.contracts),
				salesChannels: sortIds(f.salesChannels),
				brands: sortIds(f.brands)
			}
		] as const,
	regionsByBrandData: (f: CardsKeyInput) =>
		[
			"offtake",
			"driversRegions",
			{
				year: f.year,
				sourceType: f.sourceType,
				bindType: f.bindType,
				period: f.period,
				counterparties: sortIds(f.counterparties),
				contracts: sortIds(f.contracts),
				salesChannels: sortIds(f.salesChannels),
				brands: sortIds(f.brands)
			}
		] as const,
	trendData: (f: CardsKeyInput) =>
		[
			"offtake",
			"trendData",
			{
				year: f.year,
				sourceType: f.sourceType,
				bindType: f.bindType,
				period: f.period,
				counterparties: sortIds(f.counterparties),
				contracts: sortIds(f.contracts),
				salesChannels: sortIds(f.salesChannels),
				brands: sortIds(f.brands)
			}
		] as const
};
