import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "ics-ui-kit/components/select";
import { FilterField } from "../../../../../shared/bi-dashboard/ui/FilterField";
import { usePanelStore } from "../store/usePanelStore";
import { usePromoCalendarContext } from "../../../PromoCalendarContext";
import { useText } from "../../../i18n";

export function YearSelect() {
	const year = usePanelStore((s) => s.year);
	const setYear = usePanelStore((s) => s.setYear);
	const { years } = usePromoCalendarContext();
	const text = useText();

	return (
		<FilterField label={text("panel.year")}>
			<Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
				<SelectTrigger className="w-28">
					<SelectValue placeholder={text("panel.year")} />
				</SelectTrigger>
				<SelectContent>
					{years.map((y) => (
						<SelectItem key={y} value={String(y)}>
							{y}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</FilterField>
	);
}
