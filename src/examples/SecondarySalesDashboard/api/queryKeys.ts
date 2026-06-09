import { sortIds } from "../../../shared/bi-dashboard/api/queryKeys";
import type { BaseScope, BrandScope, CounterpartyBrandScope, CounterpartyScope } from "./scopes";

export const secondarySalesKeys = {
	distributors: (search: string) => ["secondarySales", "filters", "distributors", search.trim().toLowerCase()] as const,
	brands: (search: string) => ["secondarySales", "filters", "brands", search.trim().toLowerCase()] as const,
	cards: (f: BaseScope) => ["secondarySales", "cards", { ...f }] as const,
	topDistributorsData: (f: BaseScope) => ["secondarySales", "grids", "topDistributors", { ...f }] as const,
	topRegionsData: (f: CounterpartyBrandScope) =>
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
	topBrandsData: (f: CounterpartyScope) =>
		["secondarySales", "grids", "topBrands", { ...f, counterparties: sortIds(f.counterparties) }] as const,

	distributorsByBrandData: (f: BrandScope) =>
		[
			"secondarySales",
			"charts",
			"driversDistributors",
			{
				year: f.year,
				sourceType: f.sourceType,
				bindType: f.bindType,
				period: f.period,
				brands: sortIds(f.brands)
			}
		] as const,
	regionsByBrandData: (f: CounterpartyBrandScope) =>
		[
			"secondarySales",
			"charts",
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
	trendData: (f: CounterpartyBrandScope) =>
		[
			"secondarySales",
			"charts",
			"trend",
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
