import { useFiltersStore, type Metric } from "../stores/useFiltersStore";
import { formatMetric, formatMetricParts } from "./metricFormat";

export const useMetricFormat = (override?: Metric) => {
	const fromStore = useFiltersStore((s) => s.metric);
	const metric = override ?? fromStore;
	return {
		metric,
		compact: (value: number) => formatMetric(value, metric, "compact"),
		full: (value: number) => formatMetric(value, metric, "full"),
		fullParts: (value: number) => formatMetricParts(value, metric, "full")
	};
};
