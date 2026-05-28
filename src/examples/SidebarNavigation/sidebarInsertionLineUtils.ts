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

/**
 * Поведение линии вставки в зависимости от типа узла:
 *
 * Раскрытая папка:
 *    - Линия стоит перед первым дочерним — доступен только один вариант: добавить дочерний.
 *    - Линия не двигается.
 * Свёрнутая папка / обычный узел:
 *    - Линия двигается от "добавить на том же уровне" (левее) до "добавить дочерний" (правее).
 *    - По умолчанию встаёт на дочерний уровень (maxDepth).
 * Ограничение влево (minDepth):
 *    - Нельзя вставить выше ближайшего предка, у которого есть следующий сосед —
 *    - иначе этот сосед окажется без родителя.
 *    - Если таких предков нет — линию можно двигать вплоть до уровня 1.
 */

export function getInsertionConfig(
	id: string,
	level: number,
	isOpenFolder: boolean,
	items: Record<string, Item>,
	parentMap: Record<string, string>
): { minDepth: number; maxDepth: number } {
	if (isOpenFolder) {
		return { minDepth: level + 1, maxDepth: level + 1 };
	}

	let minDepth = 1;
	let curId = id;
	let curLevel = level;
	while (curLevel > 1) {
		const pid = parentMap[curId];
		if (!pid) break;
		const siblings = items[pid]?.children ?? [];
		const isLast = siblings.at(-1) === curId;
		if (!isLast) {
			minDepth = curLevel;
			break;
		}
		curId = pid;
		curLevel--;
	}

	return { minDepth, maxDepth: level + 1 };
}
