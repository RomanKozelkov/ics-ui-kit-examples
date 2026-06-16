import { useTimelineContext } from "dnd-timeline";
import { DAY_GRID_MIN_PX, MS_DAY } from "../utils/constants";

/** Derived geometry for the timeline header: column width + zoom-aware flags. */
export function useTimelineHeader() {
	const { sidebarWidth, valueToPixels } = useTimelineContext();
	const dayPx = valueToPixels(MS_DAY);

	return {
		sidebarWidth,
		valueToPixels,
		dayPx,
		/** Below this zoom a day is too narrow to read, so the day row is dropped entirely. */
		showDayGrid: dayPx >= DAY_GRID_MIN_PX
	};
}
