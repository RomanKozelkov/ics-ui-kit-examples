import { Z_INDEX } from "../utils/z-index";
import { useTimelineHeader } from "../hooks/useTimelineHeader";
import type { TimelineModel } from "../utils/timeline";
import { HeaderMonthRow } from "./HeaderMonthRow";
import { HeaderDayRow } from "./HeaderDayRow";

/**
 * Шапка контентной колонки (two-pane): месяцы + дни. Сайдбар-угол вынесен в SidebarColumn.
 * `leftWidth` — ширина залипающей сайдбар-колонки; метка месяца залипает правее неё.
 */
export function TimelineHeader({ timeline, leftWidth }: { timeline: TimelineModel; leftWidth: number }) {
	const { valueToPixels, dayPx, showDayGrid, headerHeight } = useTimelineHeader();

	return (
		<div
			className="sticky top-0 flex w-full flex-col border-b border-border bg-primary-bg"
			style={{ height: headerHeight, zIndex: Z_INDEX.header }}
		>
			<HeaderMonthRow months={timeline.months} valueToPixels={valueToPixels} labelOffset={leftWidth} />
			{showDayGrid && <HeaderDayRow days={timeline.days} dayPx={dayPx} />}
		</div>
	);
}
