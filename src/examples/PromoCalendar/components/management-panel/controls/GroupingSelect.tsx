import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "ics-ui-kit/components/select";
import { FilterField } from "../../../../../shared/bi-dashboard/ui/FilterField";
import { usePanelStore, type Grouping } from "../store/panel.store";
import { GROUPING_OPTIONS, isGrouping } from "../data/options";
import { useText } from "../../../i18n";

export function GroupingSelect() {
	const grouping = usePanelStore((s) => s.grouping);
	const setGrouping = usePanelStore((s) => s.setGrouping);
	const text = useText();

	return (
		<FilterField label={text("panel.grouping")}>
			<Select value={grouping} onValueChange={(v) => isGrouping(v as Grouping) && setGrouping(v as Grouping)}>
				<SelectTrigger className="w-44">
					<SelectValue placeholder={text("panel.grouping")} />
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
