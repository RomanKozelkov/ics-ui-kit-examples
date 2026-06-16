import { useTimelineContext, useTimelineMonitor } from "dnd-timeline";

/** По окончании драга превращает событие в новый интервал промо. */
export function useItemDragMonitor(onItemMoved: (id: string, startMs: number, endMs: number) => void) {
	const { getSpanFromDragEvent } = useTimelineContext();

	useTimelineMonitor({
		onDragEnd: (event) => {
			const span = getSpanFromDragEvent(event);
			if (!span) return;
			onItemMoved(String(event.active.id), span.start, span.end);
		}
	});
}
