import { useQuery } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import { useFiltersStore } from "../stores/useFiltersStore";
import { primarySalesKeys } from "../api/queryKeys";
import { fetchDistributorsTable, fetchBrandsTable } from "../api/fetchers";
import { aggregateDrivers } from "./aggregateDrivers";

export type DriversView = "products" | "distributors";

export function useDriversChart(view: DriversView) {
	const input = useFiltersStore(
		useShallow((s) => ({
			year: s.year,
			metric: s.metric,
			currency: s.currency,
			sourceType: s.sourceType,
			bindType: s.bindType,
			period: s.period,
			counterparties: s.counterparties,
			brands: s.brands
		}))
	);

	const isDistributors = view === "distributors";

	return useQuery({
		queryKey: isDistributors
			? primarySalesKeys.distributorsTable(input)
			: primarySalesKeys.brandsTable(input),
		queryFn: () => (isDistributors ? fetchDistributorsTable(input) : fetchBrandsTable(input)),
		select: aggregateDrivers
	});
}
