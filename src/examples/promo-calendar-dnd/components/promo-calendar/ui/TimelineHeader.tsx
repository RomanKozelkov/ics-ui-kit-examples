import { useTimelineContext } from "dnd-timeline";
import { HEAD_DAY_H, HEAD_MONTH_H, DAY_NUMBER_MIN_PX, MS_DAY } from "../utils/constants";
import type { TimelineModel } from "../utils/timeline";

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
	timeline: TimelineModel;
};

export function TimelineHeader({ timeline }: Props) {
	const { sidebarWidth, valueToPixels } = useTimelineContext();
	const dayPx = valueToPixels(MS_DAY);
	const showDayNumbers = dayPx >= DAY_NUMBER_MIN_PX;

	return (
		<div className="sticky top-0 z-[4] flex w-full border-b border-border bg-primary-bg">
			<div className="sticky left-0 z-[5] shrink-0 bg-primary-bg" style={{ width: sidebarWidth }}>
				<div className="flex h-full items-center px-2 text-xs font-medium text-muted-foreground">Группа</div>
			</div>
			<div className="relative flex-1" style={{ height: HEAD_MONTH_H + HEAD_DAY_H }}>
				<div className="absolute inset-x-0 top-0" style={{ height: HEAD_MONTH_H }}>
					{timeline.months.map((m) => {
						const left = valueToPixels(m.startIndex * MS_DAY);
						const width = valueToPixels(m.dayCount * MS_DAY);
						return (
							<div
								key={m.key}
								className="absolute top-0 flex h-full items-center overflow-hidden border-r border-border"
								style={{ left, width }}
							>
								<span className="sticky left-2 whitespace-nowrap px-1 text-xs font-semibold text-primary-fg">
									{MONTHS_RU[m.month]}
									<span className="font-normal text-muted-foreground"> {m.year}</span>
								</span>
							</div>
						);
					})}
				</div>
				<div className="absolute inset-x-0" style={{ top: HEAD_MONTH_H, height: HEAD_DAY_H }}>
					{timeline.days.map((d) => {
						const left = valueToPixels(d.dayIndex * MS_DAY);
						const isMonday = d.dow === 1;
						return (
							<div
								key={d.dayIndex}
								className={[
									"absolute top-0 flex h-full items-center justify-center font-mono text-[11px] tabular-nums",
									d.isWeekend ? "bg-muted/40 text-muted-foreground" : "text-primary-fg",
									isMonday ? "border-l border-border" : ""
								].join(" ")}
								style={{ left, width: dayPx }}
							>
								{showDayNumbers ? d.day : <span className="block h-2 w-px bg-border" />}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
