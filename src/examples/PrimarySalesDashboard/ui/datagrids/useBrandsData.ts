import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import { useFiltersStore } from "../../stores/useFiltersStore";
import { primarySalesKeys } from "../../api/queryKeys";
import { fetchBrandsData } from "../../api/fetchers";
import { aggregateRanking, pickMeasureField, type RankingRow } from "../../../../shared/bi-dashboard/ranking/aggregateRanking";

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
		queryFn: () => fetchBrandsData(input),
		placeholderData: keepPreviousData
	});
}

type BrandsTableView = { data: BrandRow[] | undefined; isStale: boolean };

export function useBrandsTableView(): BrandsTableView {
	const metric = useFiltersStore((s) => s.metric);
	const { data, isPlaceholderData } = useTopBrandsData();
	if (!data) return { data: undefined, isStale: false };
	return {
		data: aggregateRanking(data.rows, data.year, pickMeasureField(metric)),
		isStale: isPlaceholderData
	};
}
