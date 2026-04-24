import { useQuery } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import { useFiltersStore } from "../../stores/useFiltersStore";
import { primarySalesKeys } from "../../api/queryKeys";
import { fetchBrandsData } from "../../api/fetchers";
import { aggregateRanking, pickMeasureField, type RankingRow } from "./aggregateRanking";

export type BrandRow = RankingRow;

export function useTopBrandsData() {
	const input = useFiltersStore(
		useShallow((s) => ({
			year: s.year,
			sourceType: s.sourceType,
			bindType: s.bindType,
			period: s.period,
			counterparties: s.counterparties
		}))
	);

	return useQuery({
		queryKey: primarySalesKeys.topBrandsData(input),
		queryFn: () => fetchBrandsData(input)
	});
}

export function useBrandsTableView(): { data: BrandRow[] | undefined; isLoading: boolean } {
	const metric = useFiltersStore((s) => s.metric);
	const currency = useFiltersStore((s) => s.currency);
	const { data, isLoading } = useTopBrandsData();
	if (!data) return { data: undefined, isLoading };
	return { data: aggregateRanking(data.rows, data.year, pickMeasureField(metric, currency)), isLoading };
}
