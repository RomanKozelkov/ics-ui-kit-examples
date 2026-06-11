import type { TimelineDay, TimelineMonth } from "../utils/timeline";
import { HEAD_DAY_H, HEAD_MONTH_H } from "../utils/constants";

const MONTHS_RU = [
	"Январь",
	"Февраль",
	"Март",
	"Апрель",
	"Май",
	"Июнь",
	"Июль",
	"Август",
	"Сентябрь",
	"Октябрь",
	"Ноябрь",
	"Декабрь"
];

export function Header({ months, days, dayWidth }: { months: TimelineMonth[]; days: TimelineDay[]; dayWidth: number }) {
	return (
		<div
			className="sticky top-0 z-[3] shrink-0 border-b border-border bg-primary-bg"
			style={{ width: days.length * dayWidth }}
		>
			{/* Level 1: months */}
			<div className="flex" style={{ height: HEAD_MONTH_H }}>
				{months.map((m) => (
					<div
						key={m.key}
						className="flex shrink-0 items-center border-r border-border"
						style={{ width: m.dayCount * dayWidth }}
					>
						{/* sticky so label stays visible while scrolling horizontally */}
						<span className="sticky left-2.5 whitespace-nowrap px-2 text-xs font-semibold text-primary-fg">
							{MONTHS_RU[m.month]}
							<span className="font-normal text-muted-foreground"> {m.year}</span>
						</span>
					</div>
				))}
			</div>

			{/* Level 2: day numbers */}
			<div className="flex" style={{ height: HEAD_DAY_H }}>
				{days.map((d) => (
					<div
						key={d.dayIndex}
						className={[
							"flex shrink-0 items-center justify-center border-r border-border/40 font-mono text-[11px] tabular-nums",
							d.isWeekend ? "bg-muted/40 text-muted-foreground" : "text-primary-fg"
						].join(" ")}
						style={{ width: dayWidth }}
					>
						{d.day}
					</div>
				))}
			</div>
		</div>
	);
}
