import { useTimelineContext } from "dnd-timeline";
import { MS_DAY } from "../utils/constants";
import { todayUTCms } from "../utils/date";
import type { TimelineModel } from "../utils/timeline";

type Props = {
	timeline: TimelineModel;
};

export function GridBackground({ timeline }: Props) {
	const { sidebarWidth, valueToPixels } = useTimelineContext();
	const todayMs = todayUTCms();
	const todayInRange = todayMs >= timeline.startMs && todayMs < timeline.endMs;
	const dayPx = valueToPixels(MS_DAY);

	return (
		<div
			aria-hidden
			className="pointer-events-none absolute inset-y-0 z-[1]"
			style={{ left: sidebarWidth, right: 0 }}
		>
			{timeline.days.map((d) => {
				if (!d.isWeekend && d.dow !== 1) return null;
				const left = valueToPixels(d.dayIndex * MS_DAY);
				if (d.isWeekend) {
					return (
						<div
							key={`w${d.dayIndex}`}
							className="absolute inset-y-0 bg-muted/25"
							style={{ left, width: dayPx }}
						/>
					);
				}
				return (
					<div
						key={`m${d.dayIndex}`}
						className="absolute inset-y-0 border-l border-border/60"
						style={{ left, width: 1 }}
					/>
				);
			})}
			{todayInRange && (
				<div
					className="absolute inset-y-0 bg-destructive"
					style={{
						left: valueToPixels(todayMs - timeline.startMs) + dayPx / 2 - 1,
						width: 2
					}}
				/>
			)}
		</div>
	);
}
