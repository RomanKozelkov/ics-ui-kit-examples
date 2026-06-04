import { SegmentedFilter } from "../../../../shared/bi-dashboard/filters/SegmentedFilter";
import { useFiltersStore } from "../../stores/useFiltersStore";

const OPTIONS = [2023, 2024, 2025, 2026].map((y) => ({ value: String(y) }));

export function FilterYear() {
	const year = useFiltersStore((s) => s.year);
	const setYear = useFiltersStore((s) => s.setYear);

	return (
		<SegmentedFilter
			label="Год анализа"
			value={String(year)}
			options={OPTIONS}
			onChange={(v) => setYear(Number(v))}
		/>
	);
}
