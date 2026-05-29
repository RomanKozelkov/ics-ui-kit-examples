import type { DropPosition } from "../types/DndTypes";

export function getDropPosition(pointerY: number, rectTop: number, rectHeight: number): DropPosition {
	const relative = pointerY - rectTop;
	const ratio = relative / rectHeight;
	if (ratio < 0.25) return "before";
	if (ratio > 0.75) return "after";
	return "child";
}
