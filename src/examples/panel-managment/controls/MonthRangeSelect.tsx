import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "ics-ui-kit/components/select";
import { FilterField } from "../../../shared/bi-dashboard/ui/FilterField";
import { usePanelStore } from "../store/usePanelStore";
import { MONTHS_RU } from "../data/options";

export function MonthRangeSelect() {
	const monthFrom = usePanelStore((s) => s.monthFrom);
	const monthTo = usePanelStore((s) => s.monthTo);
	const setMonthFrom = usePanelStore((s) => s.setMonthFrom);
	const setMonthTo = usePanelStore((s) => s.setMonthTo);

	return (
		<FilterField label="Месяцы">
			<div className="flex items-center gap-2">
				<Select value={String(monthFrom)} onValueChange={(v) => setMonthFrom(Number(v))}>
					<SelectTrigger className="w-36">
						<SelectValue placeholder="С" />
					</SelectTrigger>
					<SelectContent>
						{MONTHS_RU.map((m, i) => (
							<SelectItem key={m} value={String(i)}>
								{m}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<span className="text-sm text-muted-foreground">—</span>

				<Select value={String(monthTo)} onValueChange={(v) => setMonthTo(Number(v))}>
					<SelectTrigger className="w-36">
						<SelectValue placeholder="По" />
					</SelectTrigger>
					<SelectContent>
						{MONTHS_RU.map((m, i) => (
							<SelectItem key={m} value={String(i)} disabled={i < monthFrom}>
								{m}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</FilterField>
	);
}
