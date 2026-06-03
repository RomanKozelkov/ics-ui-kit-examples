import { SIDEBAR_MENU_SUB_INDENT, INSERTION_BUTTON_SIZE } from "./constants";

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
