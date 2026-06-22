import { HEAD_DAY_H } from "../utils/layout";
import type { TimelineDay } from "../utils/timeline";

type Props = {
	days: TimelineDay[];
	dayPx: number;
};

/** Bottom header band: one cell per day with its number. */
export function HeaderDayRow({ days, dayPx }: Props) {
	return (
		<div className="flex" style={{ height: HEAD_DAY_H }}>
			{days.map((d) => (
				<div
					key={d.dayIndex}
					className={[
						"flex h-full shrink-0 items-center justify-center font-mono text-[11px] tabular-nums",
						d.dow === 1 ? "border-l border-border" : ""
					].join(" ")}
					style={{
						width: dayPx
					}}
				>
					{d.day}
				</div>
			))}
		</div>
	);
}
