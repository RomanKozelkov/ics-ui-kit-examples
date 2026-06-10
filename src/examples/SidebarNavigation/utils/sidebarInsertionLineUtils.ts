import { SIDEBAR_MENU_SUB_INDENT, INSERTION_BUTTON_SIZE } from "./constants";
import type { ParentMap } from "./getParentMap";
import type { Item } from "../data/navigationData";

// хит-зона иконки на глубине d — это сама иконка плюс коннектор справа от неё. Порог переключения — на левом крае следующей иконки.
export function depthFromMouseX(offsetX: number, maxDepth: number, minDepth: number, levelOffset = 0): number {
	const iconLeftOffset = INSERTION_BUTTON_SIZE / 2 - 0.5;
	const raw = Math.floor((offsetX + iconLeftOffset) / SIDEBAR_MENU_SUB_INDENT) + 1 + levelOffset;
	return Math.min(maxDepth, Math.max(minDepth, raw));
}

// возвращает CSS left для иконки на заданной глубине — центрирует иконку по линии отступа
export function iconLeft(depth: number, levelOffset = 0): number {
	return (depth - 1 - levelOffset) * SIDEBAR_MENU_SUB_INDENT - INSERTION_BUTTON_SIZE / 2 + 0.5;
}

// минимальная глубина вставки после узла: поднимаемся вверх пока узел последний в своём родителе
export function getMinInsertionDepth(
	id: string,
	level: number,
	items: Record<string, Item>,
	parentMap: ParentMap
): number {
	let curId = id;
	let curLevel = level;
	while (curLevel > 1) {
		const pid = parentMap[curId];
		if (!pid) break;
		const siblings = items[pid]?.children ?? [];
		if (siblings.at(-1) !== curId) return curLevel;
		curId = pid;
		curLevel--;
	}
	return 1;
}

// id родителя при вставке на заданную глубину после узла id на уровне level
export function getParentIdAtDepth(
	id: string,
	level: number,
	targetDepth: number,
	parentMap: ParentMap
): string | null {
	if (targetDepth > level) return id;
	let cur = id;
	let depth = level;
	while (depth > targetDepth) {
		const pid = parentMap[cur];
		if (!pid) break;
		cur = pid;
		depth--;
	}
	return parentMap[cur] ?? null;
}
