import { Fragment } from "react";
import { FieldSegmentedToggleGroup } from "../../../../shared/components/FieldSegmentedToggleGroup";
import {
	SegmentedToggleDivider,
	SegmentedToggleItem
} from "../../../../shared/components/SegmentedToggle";
import { useFiltersStore } from "../../stores/useFiltersStore";

const YEARS = [2023, 2024, 2025, 2026];

export function FilterYear() {
	const year = useFiltersStore((s) => s.year);
	const setYear = useFiltersStore((s) => s.setYear);

	return (
		<FieldSegmentedToggleGroup
			label="Год анализа"
			type="single"
			value={String(year)}
			onValueChange={(v) => v && setYear(Number(v))}
		>
			{YEARS.map((y, i) => (
				<Fragment key={y}>
					{i > 0 && <SegmentedToggleDivider />}
					<SegmentedToggleItem value={String(y)}>{y}</SegmentedToggleItem>
				</Fragment>
			))}
		</FieldSegmentedToggleGroup>
	);
}
