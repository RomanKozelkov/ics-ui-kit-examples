import { sortIds } from "../../../shared/bi-dashboard/api/queryKeys";
import type { BaseScope, BrandScope, CounterpartyBrandScope, CounterpartyScope } from "./scopes";

export const primarySalesKeys = {
	distributors: (search: string) => ["primarySales", "filters", "distributors", search.trim().toLowerCase()] as const,
	brands: (search: string) => ["primarySales", "filters", "brands", search.trim().toLowerCase()] as const,
	cards: (f: BaseScope) => ["primarySales", "cards", { ...f }] as const,
	topDistributorsData: (f: BaseScope) => ["primarySales", "grids", "topDistributors", { ...f }] as const,
	topBrandsData: (f: CounterpartyScope) =>
		["primarySales", "grids", "topBrands", { ...f, counterparties: sortIds(f.counterparties) }] as const,
	distributorsByBrandData: (f: BrandScope) =>
		[
			"primarySales",
			"charts",
			"driversDistributors",
			{
				...f,
				brands: sortIds(f.brands)
			}
		] as const,
	trendData: (f: CounterpartyBrandScope) =>
		[
			"primarySales",
			"charts",
			"trend",
			{
				...f,
				counterparties: sortIds(f.counterparties),
				brands: sortIds(f.brands)
			}
		] as const
};
