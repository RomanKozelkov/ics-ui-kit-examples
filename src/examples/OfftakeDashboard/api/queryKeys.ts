import { sortIds } from "../../../shared/bi-dashboard/api/queryKeys";
import type { Scope } from "./scopes";

export const offtakeKeys = {
	distributors: (search: string) => ["offtake", "filters", "distributors", search.trim().toLowerCase()] as const,
	contracts: (search: string) => ["offtake", "filters", "contracts", search.trim().toLowerCase()] as const,
	salesChannels: (search: string) => ["offtake", "filters", "salesChannels", search.trim().toLowerCase()] as const,
	brands: (search: string) => ["offtake", "filters", "brands", search.trim().toLowerCase()] as const,
	cards: (f: Scope) =>
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
	topDistributorsData: (f: Scope) =>
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
	topRegionsData: (f: Scope) =>
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
	topBrandsData: (f: Scope) =>
		[
			"offtake",
			"grids",
			"topBrands",
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

	distributorsByBrandData: (f: Scope) =>
		[
			"offtake",
			"charts",
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
	regionsByBrandData: (f: Scope) =>
		[
			"offtake",
			"charts",
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
	trendData: (f: Scope) =>
		[
			"offtake",
			"charts",
			"trend",
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
