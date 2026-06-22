import type { DragDirection, Span } from "dnd-timeline";
import { MS_DAY } from "./date";
import { RESIZE_HANDLE_W } from "./layout";

/** День у нужного края span'а: start — первый день, end — последний (span хранится exclusive). */
export function edgeDay(side: DragDirection, span: Span): number {
	return side === "start" ? span.start : span.end - MS_DAY;
}

/** Какой край бара под курсором (ltr): дублирует порог dnd-timeline, чтобы показать подсказку до старта ресайза. */
export function edgeUnderCursor(clientX: number, rect: DOMRect): DragDirection | null {
	if (Math.abs(clientX - rect.left) <= RESIZE_HANDLE_W / 2) return "start";
	if (Math.abs(clientX - rect.right) <= RESIZE_HANDLE_W / 2) return "end";
	return null;
}
