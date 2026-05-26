import { Fragment } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "ics-ui-kit/components/tooltip";
import { FieldSegmentedToggleGroup } from "../../../../shared/components/FieldSegmentedToggleGroup";
import {
	SegmentedToggleDivider,
	SegmentedToggleItem
} from "../../../../shared/components/SegmentedToggle";
import { useFiltersStore, type Period } from "../../stores/useFiltersStore";

const PERIOD_HINTS: Record<Period, string> = {
	FY: "Полный финансовый год",
	YTD: "От начала года по сегодняшнее число",
	QTD: "От начала текущего квартала по сегодняшнее число",
	MTD: "От начала текущего месяца по сегодняшнее число"
};

const PERIODS = Object.keys(PERIOD_HINTS) as Period[];

export function FilterPeriod() {
	const period = useFiltersStore((s) => s.period);
	const setPeriod = useFiltersStore((s) => s.setPeriod);
	const year = useFiltersStore((s) => s.year);

	if (year !== new Date().getFullYear()) return null;

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<div className="w-fit">
					<FieldSegmentedToggleGroup
						label="Период"
						type="single"
						value={period}
						onValueChange={(v) => v && setPeriod(v as Period)}
					>
						{PERIODS.map((p, i) => (
							<Fragment key={p}>
								{i > 0 && <SegmentedToggleDivider />}
								<SegmentedToggleItem value={p}>{p}</SegmentedToggleItem>
							</Fragment>
						))}
					</FieldSegmentedToggleGroup>
				</div>
			</TooltipTrigger>
			<TooltipContent side="bottom" className="max-w-xs">
				<dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1">
					{PERIODS.map((p) => (
						<Fragment key={p}>
							<dt className="font-medium">{p}</dt>
							<dd className="text-xs">{PERIOD_HINTS[p]}</dd>
						</Fragment>
					))}
				</dl>
			</TooltipContent>
		</Tooltip>
	);
}
