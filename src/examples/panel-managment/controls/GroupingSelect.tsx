import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "ics-ui-kit/components/select";
import { FilterField } from "../../../shared/bi-dashboard/ui/FilterField";
import { usePanelStore } from "../store/usePanelStore";
import { GROUPING_OPTIONS, isGrouping } from "../data/options";

export function GroupingSelect() {
	const grouping = usePanelStore((s) => s.grouping);
	const setGrouping = usePanelStore((s) => s.setGrouping);

	return (
		<FilterField label="Группировка">
			<Select value={grouping} onValueChange={(v) => isGrouping(v) && setGrouping(v)}>
				<SelectTrigger className="w-44">
					<SelectValue placeholder="Группировка" />
				</SelectTrigger>
				<SelectContent>
					{GROUPING_OPTIONS.map((o) => (
						<SelectItem key={o.value} value={o.value}>
							{o.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</FilterField>
	);
}
