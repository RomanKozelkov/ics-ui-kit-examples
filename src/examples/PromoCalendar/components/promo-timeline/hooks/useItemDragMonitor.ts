import { useTimelineContext, useTimelineMonitor } from "dnd-timeline";

/** По окончании драга/ресайза превращает событие в новый интервал промо. */
export function useItemDragMonitor(onPeriodChange: (id: string, startMs: number, endMs: number) => void) {
	const { getSpanFromDragEvent, getSpanFromResizeEvent } = useTimelineContext();

	useTimelineMonitor({
		onDragEnd: (event) => {
			const span = getSpanFromDragEvent(event);
			if (!span) return;
			onPeriodChange(String(event.active.id), span.start, span.end);
		},
		onResizeEnd: (event) => {
			const span = getSpanFromResizeEvent(event);
			if (!span) return;
			onPeriodChange(String(event.active.id), span.start, span.end);
		}
	});
}
