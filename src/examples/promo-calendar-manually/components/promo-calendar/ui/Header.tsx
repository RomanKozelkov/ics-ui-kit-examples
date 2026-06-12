import type { TimelineDay, TimelineMonth } from "../utils/timeline";
import { HEAD_DAY_H, HEAD_MONTH_H, LEFT_W } from "../utils/constants";

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

type Props = {
	months: TimelineMonth[];
	days: TimelineDay[];
	dayWidth: number;
	showDayNumbers: boolean;
};

export function Header({ months, days, dayWidth, showDayNumbers }: Props) {
	return (
		<div className="sticky top-0 z-[4] flex w-full shrink-0 border-b border-border bg-primary-bg">
			{/* sticky left corner — остаётся при горизонтальном скролле, перекрывает дни (z-5) */}
			<div
				className="sticky left-0 z-[5] flex shrink-0 items-end border-r border-border bg-primary-bg px-2 pb-1 text-xs font-medium text-muted-foreground"
				style={{ width: LEFT_W }}
			>
				Группа
			</div>

			<div className="shrink-0" style={{ width: days.length * dayWidth }}>
				{/* Level 1: months */}
				<div className="flex" style={{ height: HEAD_MONTH_H }}>
					{months.map((m) => (
						<div
							key={m.key}
							className="flex shrink-0 items-center overflow-hidden border-r border-border"
							style={{ width: m.dayCount * dayWidth }}
						>
							<span className="sticky left-2 whitespace-nowrap px-1 text-xs font-semibold text-primary-fg">
								{MONTHS_RU[m.month]}
								<span className="font-normal text-muted-foreground"> {m.year}</span>
							</span>
						</div>
					))}
				</div>

				{/* Level 2: days — номера или тонкие засечки (адаптивная плотность) */}
				<div className="flex" style={{ height: HEAD_DAY_H }}>
					{days.map((d) => (
						<div
							key={d.dayIndex}
							className={[
								"flex shrink-0 items-center justify-center font-mono text-[11px] tabular-nums",
								d.isWeekend ? "bg-muted/40 text-muted-foreground" : "text-primary-fg",
								d.dow === 1 ? "border-l border-border" : "border-l border-border/30"
							].join(" ")}
							style={{ width: dayWidth }}
						>
							{showDayNumbers ? d.day : <span className="block h-2 w-px bg-border" />}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
