import { INDENT_SIDEBAR_ITEM_WIDTH } from "./constants";
import type { Item } from "./navigationData";

export const BASE_X = 12;

export function depthFromMouseX(offsetX: number, maxDepth: number, minDepth: number): number {
	const raw = Math.round((offsetX - BASE_X) / INDENT_SIDEBAR_ITEM_WIDTH) + 1;
	return Math.min(maxDepth, Math.max(minDepth, raw));
}

export function buildParentMap(items: Record<string, Item>): Record<string, string> {
	const map: Record<string, string> = {};
	for (const [id, item] of Object.entries(items)) {
		for (const childId of item.children ?? []) {
			map[childId] = id;
		}
	}
	return map;
}
