import { Fragment } from "react";
import { FieldSegmentedToggleGroup } from "../../../../shared/components/FieldSegmentedToggleGroup";
import {
	SegmentedToggleDivider,
	SegmentedToggleItem
} from "../../../../shared/components/SegmentedToggle";
import { useFiltersStore, type Metric } from "../../stores/useFiltersStore";

const METRICS: Metric[] = ["RUB", "USD", "Units"];

export function FilterMetric() {
	const metric = useFiltersStore((s) => s.metric);
	const setMetric = useFiltersStore((s) => s.setMetric);

	return (
		<FieldSegmentedToggleGroup
			label="Метрика"
			type="single"
			value={metric}
			onValueChange={(v) => v && setMetric(v as Metric)}
		>
			{METRICS.map((m, i) => (
				<Fragment key={m}>
					{i > 0 && <SegmentedToggleDivider />}
					<SegmentedToggleItem value={m}>{m}</SegmentedToggleItem>
				</Fragment>
			))}
		</FieldSegmentedToggleGroup>
	);
}
