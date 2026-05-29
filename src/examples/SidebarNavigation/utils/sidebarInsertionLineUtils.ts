import { SIDEBAR_MENU_SUB_INDENT, INSERTION_BUTTON_SIZE } from "./constants";

export function depthFromMouseX(offsetX: number, maxDepth: number, minDepth: number, levelOffset = 0): number {
	const raw = Math.round(offsetX / SIDEBAR_MENU_SUB_INDENT) + 1 + levelOffset;
	return Math.min(maxDepth, Math.max(minDepth, raw));
}

export function iconLeft(depth: number, levelOffset = 0): number {
	return (depth - 1 - levelOffset) * SIDEBAR_MENU_SUB_INDENT - INSERTION_BUTTON_SIZE / 2;
}
