import { useTimelineContext } from "dnd-timeline";
import { DAY_GRID_MIN_PX, HEAD_DAY_H, HEAD_MONTH_H, MS_DAY } from "../utils/constants";

/** Derived geometry for the timeline header: column width + zoom-aware flags. */
export function useTimelineHeader() {
	const { sidebarWidth, valueToPixels } = useTimelineContext();
	const dayPx = valueToPixels(MS_DAY);
	/** Below this zoom a day is too narrow to read, so the day row is dropped entirely. */
	const showDayGrid = dayPx >= DAY_GRID_MIN_PX;

	return {
		sidebarWidth,
		valueToPixels,
		dayPx,
		showDayGrid,
		/** Полная высота залипающей шапки; на неё опираются sticky-top заголовки групп. */
		headerHeight: showDayGrid ? HEAD_MONTH_H + HEAD_DAY_H : HEAD_MONTH_H
	};
}
