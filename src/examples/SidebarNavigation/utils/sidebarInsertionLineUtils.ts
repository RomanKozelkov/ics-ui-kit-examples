import { INDENT_SIDEBAR_ITEM_WIDTH, INSERTION_BUTTON_SIZE } from "./constants";

export function depthFromMouseX(offsetX: number, maxDepth: number, minDepth: number): number {
	const raw = Math.round(offsetX / INDENT_SIDEBAR_ITEM_WIDTH) + 1;
	return Math.min(maxDepth, Math.max(minDepth, raw));
}

export function iconLeft(depth: number): number {
	return (depth - 1) * INDENT_SIDEBAR_ITEM_WIDTH - INSERTION_BUTTON_SIZE / 2;
}
