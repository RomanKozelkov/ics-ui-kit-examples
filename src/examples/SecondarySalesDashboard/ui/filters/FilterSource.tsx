import { SegmentedFilter } from "../../../../shared/bi-dashboard/filters/SegmentedFilter";
import { useFiltersStore, type SourceType } from "../../stores/useFiltersStore";

const OPTIONS = (["MDLP", "Sales"] satisfies SourceType[]).map((s) => ({ value: s }));

export function FilterSource() {
	const sourceType = useFiltersStore((s) => s.sourceType);
	const setSourceType = useFiltersStore((s) => s.setSourceType);

	return (
		<SegmentedFilter
			label="Источник"
			value={sourceType}
			options={OPTIONS}
			onChange={(v) => setSourceType(v as SourceType)}
		/>
	);
}
