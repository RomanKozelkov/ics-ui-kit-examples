import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "ics-ui-kit/components/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "ics-ui-kit/components/tooltip";
import { Info } from "lucide-react";
import { useFiltersStore, type Period } from "../../stores/useFiltersStore";
import { FilterField } from "../components/FilterField";

const PERIOD_HINTS: Record<Period, string> = {
	FY: "Полный финансовый год",
	YTD: "От начала года по сегодняшнее число",
	QTD: "От начала текущего квартала по сегодняшнее число",
	MTD: "От начала текущего месяца по сегодняшнее число"
};

export function FilterPeriod() {
	const period = useFiltersStore((s) => s.period);
	const setPeriod = useFiltersStore((s) => s.setPeriod);

	return (
		<FilterField label="Период">
			<Select value={period} onValueChange={(v) => setPeriod(v as Period)}>
				<SelectTrigger>
					<SelectValue>{period}</SelectValue>
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{(Object.keys(PERIOD_HINTS) as Period[]).map((p) => (
							<SelectItem key={p} value={p}>
								<div className="flex items-center">
									<div>{p}</div>
									<Tooltip>
										<TooltipTrigger asChild>
											<Info className="ml-1 size-3 shrink-0 text-muted-foreground" />
										</TooltipTrigger>
										<TooltipContent side="right">{PERIOD_HINTS[p]}</TooltipContent>
									</Tooltip>
								</div>
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</FilterField>
	);
}
