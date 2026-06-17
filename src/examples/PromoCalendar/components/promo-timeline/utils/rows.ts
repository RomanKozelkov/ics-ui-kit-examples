import { GROUP_HEAD_H } from "./constants";
import type { GroupNode } from "./grouping";

export type HeaderPlacement = "embedded" | "standalone" | "none";

/**
 * Куда поместить шапку группы:
 *  - embedded   — в сайдбар первой строки (лист без перекрытий: 1+ lane, не свёрнут);
 *  - standalone — отдельной залипающей строкой (узел с детьми или свёрнутый лист);
 *  - none       — шапка не нужна (корень «без группировки»).
 */
export function resolveHeaderPlacement(group: GroupNode, showOwnHeader: boolean, collapsed: boolean): HeaderPlacement {
	if (!showOwnHeader) return "none";
	const isLeaf = group.children.length === 0;
	if (isLeaf && !collapsed && group.lanes.length > 0) return "embedded";
	return "standalone";
}

/**
 * Сдвиг sticky-top для заголовка группы на глубине `depth`: ниже основной шапки и под
 * заголовками всех родительских уровней, чтобы вложенные шапки стопкой залипали друг под другом.
 */
export function groupStickyTop(headerHeight: number, depth: number): number {
	return headerHeight + depth * GROUP_HEAD_H;
}
