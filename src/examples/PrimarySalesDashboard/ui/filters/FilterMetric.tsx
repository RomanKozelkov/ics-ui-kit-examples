import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue
} from "ics-ui-kit/components/select";
import { useFiltersStore, type Metric } from "../../stores/useFiltersStore";
import { FilterField } from "../components/FilterField";

export function FilterMetric() {
	const metric = useFiltersStore((s) => s.metric);
	const setMetric = useFiltersStore((s) => s.setMetric);

	return (
		<FilterField label="Метрика">
			<Select value={metric} onValueChange={(v) => setMetric(v as Metric)}>
				<SelectTrigger>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectItem value="Value">Value</SelectItem>
						<SelectItem value="Units">Units</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		</FilterField>
	);
}
