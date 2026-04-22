import { useQuery } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import { useFiltersStore } from "../stores/useFiltersStore";
import { primarySalesKeys } from "../api/queryKeys";
import { fetchBrandsTable } from "../api/fetchers";
import { aggregateGrouped, type GroupedRow } from "./aggregateGrouped";

export function useBrandsTable(): {
	data: GroupedRow[] | undefined;
	isLoading: boolean;
} {
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

	const { data, isLoading } = useQuery({
		queryKey: primarySalesKeys.brandsTable(input),
		queryFn: () => fetchBrandsTable(input),
		select: aggregateGrouped
	});

	return { data, isLoading };
}
