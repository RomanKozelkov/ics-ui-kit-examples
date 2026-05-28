import { FieldSegmentedToggleGroup } from "../../../../shared/components/FieldSegmentedToggleGroup";
import { SegmentedToggleDivider, SegmentedToggleItem } from "../../../../shared/components/SegmentedToggle";
import { useFiltersStore, type SourceType } from "../../stores/useFiltersStore";

export function FilterSource() {
	const sourceType = useFiltersStore((s) => s.sourceType);
	const setSourceType = useFiltersStore((s) => s.setSourceType);

	return (
		<FieldSegmentedToggleGroup
			label="Источник"
			type="single"
			value={sourceType}
			onValueChange={(v) => v && setSourceType(v as SourceType)}
		>
			<SegmentedToggleItem value="MDLP">MDLP</SegmentedToggleItem>
			<SegmentedToggleDivider />
			<SegmentedToggleItem value="Sales">Sales</SegmentedToggleItem>
		</FieldSegmentedToggleGroup>
	);
}
