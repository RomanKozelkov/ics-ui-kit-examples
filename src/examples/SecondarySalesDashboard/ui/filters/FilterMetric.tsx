import { SegmentedFilter } from "../../../../shared/bi-dashboard/filters/SegmentedFilter";
import { useFiltersStore, type Metric } from "../../stores/useFiltersStore";

const OPTIONS = (["RUB", "USD", "Units"] satisfies Metric[]).map((m) => ({ value: m }));

export function FilterMetric() {
	const metric = useFiltersStore((s) => s.metric);
	const setMetric = useFiltersStore((s) => s.setMetric);

	return (
		<SegmentedFilter
			label="Метрика"
			value={metric}
			options={OPTIONS}
			onChange={(v) => setMetric(v as Metric)}
		/>
	);
}
