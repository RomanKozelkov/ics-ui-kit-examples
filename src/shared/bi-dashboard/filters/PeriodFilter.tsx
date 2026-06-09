import { Fragment } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "ics-ui-kit/components/tooltip";
import { SegmentedFilter } from "./SegmentedFilter";

export type Period = "FY" | "YTD" | "QTD" | "MTD";

const PERIOD_HINTS: Record<Period, string> = {
	FY: "Полный финансовый год",
	YTD: "От начала года по сегодняшнее число",
	QTD: "От начала текущего квартала по сегодняшнее число",
	MTD: "От начала текущего месяца по сегодняшнее число"
};

const PERIODS = Object.keys(PERIOD_HINTS) as Period[];
const OPTIONS = PERIODS.map((p) => ({ value: p }));

type PeriodFilterProps = {
	period: Period;
	year: number;
	onChange: (period: Period) => void;
};

/**
 * Фильтр периода (FY/YTD/QTD/MTD) с подсказками-расшифровками в тултипе.
 * Показывается только для текущего года — для прошлых периодов выбор не имеет смысла.
 * Значение/год/сеттер приходят из стора дашборда через обёртку.
 */
export function PeriodFilter({ period, year, onChange }: PeriodFilterProps) {
	if (year !== new Date().getFullYear()) return null;

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<div className="w-fit">
					<SegmentedFilter
						label="Период"
						value={period}
						options={OPTIONS}
						onChange={(v) => onChange(v as Period)}
					/>
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
