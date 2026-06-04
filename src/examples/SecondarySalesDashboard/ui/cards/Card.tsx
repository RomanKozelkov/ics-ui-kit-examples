import type { Metric } from "../../stores/useFiltersStore";
import { useFiltersStore } from "../../stores/useFiltersStore";
import { useMetricFormat } from "../../utils/useMetricFormat";
import { MetricValueCard } from "../../../../shared/bi-dashboard/ui/MetricValueCard";
import { useCard } from "./useCardsData";

export function SecondarySalesCard({ metric }: { metric: Metric }) {
	const year = useFiltersStore((s) => s.year);
	const { data, isStale } = useCard(metric);
	const fmt = useMetricFormat(metric);

	return (
		<MetricValueCard label="Secondary Sales" year={year} metric={metric} fmt={fmt} card={data} isStale={isStale} />
	);
}
