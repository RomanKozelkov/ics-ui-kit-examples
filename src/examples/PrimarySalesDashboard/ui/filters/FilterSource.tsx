import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "ics-ui-kit/components/select";
import { useFiltersStore, type SourceType } from "../../stores/useFiltersStore";
import { FilterField } from "../components/FilterField";

export function FilterSource() {
	const sourceType = useFiltersStore((s) => s.sourceType);
	const setSourceType = useFiltersStore((s) => s.setSourceType);

	return (
		<FilterField label="Источник данных">
			<Select value={sourceType} onValueChange={(v) => setSourceType(v as SourceType)}>
				<SelectTrigger>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectItem value="MDLP">MDLP</SelectItem>
						<SelectItem value="Sales">Sales</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		</FilterField>
	);
}
