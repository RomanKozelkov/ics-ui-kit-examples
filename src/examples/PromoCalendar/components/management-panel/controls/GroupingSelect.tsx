import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "ics-ui-kit/components/select";
import { Field } from "ics-ui-kit/components/field";
import { usePanelStore, type Grouping } from "../store/panel.store";
import { GROUPING_OPTIONS, isGrouping } from "../data/options";
import { useText } from "../../../i18n";

export function GroupingSelect() {
	const grouping = usePanelStore((s) => s.grouping);
	const setGrouping = usePanelStore((s) => s.setGrouping);
	const text = useText();

	return (
		<Field
			className="w-auto"
			layout="vertical"
			title={text("panel.grouping")}
			control={({ id }) => (
				<Select value={grouping} onValueChange={(v) => isGrouping(v as Grouping) && setGrouping(v as Grouping)}>
					<SelectTrigger id={id} className="w-44">
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
			)}
		/>
	);
}
