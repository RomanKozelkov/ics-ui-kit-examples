import { useQuery } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import { useFiltersStore } from "../../stores/useFiltersStore";
import { primarySalesKeys } from "../../api/queryKeys";
import { fetchDistributorsData } from "../../api/fetchers";
import { aggregateRanking, pickMeasureField, type RankingRow } from "./aggregateRanking";

export type DistributorRow = RankingRow;

export function useDistributorsData() {
	const input = useFiltersStore(
		useShallow((s) => ({
			year: s.year,
			sourceType: s.sourceType,
			bindType: s.bindType,
			period: s.period
		}))
	);

	return useQuery({
		queryKey: primarySalesKeys.distributorsData(input),
		queryFn: () => fetchDistributorsData(input)
	});
}

export function useDistributorsTableView(): { data: DistributorRow[] | undefined; isLoading: boolean } {
	const metric = useFiltersStore((s) => s.metric);
	const currency = useFiltersStore((s) => s.currency);
	const { data, isLoading } = useDistributorsData();
	if (!data) return { data: undefined, isLoading };
	return { data: aggregateRanking(data.rows, data.year, pickMeasureField(metric, currency)), isLoading };
}

export function useMeasureLabel(): string {
	const metric = useFiltersStore((s) => s.metric);
	const currency = useFiltersStore((s) => s.currency);
	if (metric === "Units") return "Units";
	return currency === "USD" ? "Sales, $" : "Sales, ₽";
}
