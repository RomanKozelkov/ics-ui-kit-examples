import { HEAD_DAY_H, HEAD_MONTH_H } from "../utils/constants";
import { useTimelineHeader } from "../hooks/useTimelineHeader";
import type { TimelineModel } from "../utils/timeline";
import { HeaderSidebar } from "./HeaderSidebar";
import { HeaderMonthRow } from "./HeaderMonthRow";
import { HeaderDayRow } from "./HeaderDayRow";

type Props = {
	timeline: TimelineModel;
};

export function TimelineHeader({ timeline }: Props) {
	const { sidebarWidth, valueToPixels, dayPx, showDayGrid } = useTimelineHeader();
	const height = showDayGrid ? HEAD_MONTH_H + HEAD_DAY_H : HEAD_MONTH_H;

	return (
		<div className="sticky top-0 z-[4] flex w-full border-b border-border bg-primary-bg">
			<HeaderSidebar width={sidebarWidth} />
			<div className="flex flex-1 flex-col" style={{ height }}>
				<HeaderMonthRow months={timeline.months} valueToPixels={valueToPixels} />
				{showDayGrid && <HeaderDayRow days={timeline.days} dayPx={dayPx} />}
			</div>
		</div>
	);
}
