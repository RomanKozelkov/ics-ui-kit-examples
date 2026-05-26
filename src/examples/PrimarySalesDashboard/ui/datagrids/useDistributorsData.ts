import { useQuery } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import { useFiltersStore } from "../../stores/useFiltersStore";
import { primarySalesKeys } from "../../api/queryKeys";
import { fetchDistributorsData } from "../../api/fetchers";
import { aggregateRanking, pickMeasureField, type RankingRow } from "./aggregateRanking";

export type DistributorRow = RankingRow;

export function useTopDistributorsData() {
	const input = useFiltersStore(
		useShallow((s) => ({
			year: s.year,
			sourceType: s.sourceType,
			bindType: s.bindType,
			period: s.period
		}))
	);

	return useQuery({
		queryKey: primarySalesKeys.topDistributorsData(input),
		queryFn: () => fetchDistributorsData(input)
	});
}

type DistributorsTableView = { data: DistributorRow[] | undefined };
export function useDistributorsTableView(): DistributorsTableView {
	const metric = useFiltersStore((s) => s.metric);
	const { data } = useTopDistributorsData();
	if (!data) return { data: undefined };
	return { data: aggregateRanking(data.rows, data.year, pickMeasureField(metric)) };
}

export function useMeasureLabel(): string {
	const metric = useFiltersStore((s) => s.metric);
	if (metric === "Units") return "Units";
	return metric === "USD" ? "Sales, $" : "Sales, ₽";
}
