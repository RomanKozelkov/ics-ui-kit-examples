import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "ics-ui-kit/components/select";
import { FilterField } from "../../../shared/bi-dashboard/ui/FilterField";
import { usePanelStore } from "../store/usePanelStore";
import { YEARS } from "../data/options";

export function YearSelect() {
	const year = usePanelStore((s) => s.year);
	const setYear = usePanelStore((s) => s.setYear);

	return (
		<FilterField label="Год">
			<Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
				<SelectTrigger className="w-28">
					<SelectValue placeholder="Год" />
				</SelectTrigger>
				<SelectContent>
					{YEARS.map((y) => (
						<SelectItem key={y} value={String(y)}>
							{y}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</FilterField>
	);
}
