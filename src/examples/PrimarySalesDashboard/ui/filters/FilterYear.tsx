import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "ics-ui-kit/components/select";
import { useFiltersStore } from "../../stores/useFiltersStore";
import { FilterField } from "../components/FilterField";

export function FilterYear() {
	const year = useFiltersStore((s) => s.year);
	const setYear = useFiltersStore((s) => s.setYear);

	return (
		<FilterField label="Год анализа">
			<Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
				<SelectTrigger>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectItem value="2022">2022</SelectItem>
						<SelectItem value="2023">2023</SelectItem>
						<SelectItem value="2024">2024</SelectItem>
						<SelectItem value="2025">2025</SelectItem>
						<SelectItem value="2026">2026</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		</FilterField>
	);
}
