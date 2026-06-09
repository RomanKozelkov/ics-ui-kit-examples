import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import { useFiltersStore } from "../../stores/useFiltersStore";
import { secondarySalesKeys } from "../../api/queryKeys";
import { fetchRegionsData } from "../../api/fetchers";
import { aggregateRanking, pickMeasureField, type RankingRow } from "../../../../shared/bi-dashboard/ranking/aggregateRanking";

export type RegionRow = RankingRow;

export function useTopRegionsData() {
	const input = useFiltersStore(
		useShallow((s) => ({
			year: s.year,
			sourceType: s.sourceType,
			bindType: s.bindType,
			period: s.period,
			counterparties: s.counterparties,
			brands: s.brands
		}))
	);

	return useQuery({
		queryKey: secondarySalesKeys.topRegionsData(input),
		queryFn: () => fetchRegionsData(input),
		placeholderData: keepPreviousData
	});
}

type RegionsTableView = { data: RegionRow[] | undefined; isStale: boolean };

export function useRegionsTableView(): RegionsTableView {
	const metric = useFiltersStore((s) => s.metric);
	const { data, isPlaceholderData } = useTopRegionsData();
	if (!data) return { data: undefined, isStale: false };
	return {
		data: aggregateRanking(data.rows, data.year, pickMeasureField(metric)),
		isStale: isPlaceholderData
	};
}
