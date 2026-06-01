import { Item } from "../data/navigationData";

export function isDescendant(items: Record<string, Item>, ancestorId: string, nodeId: string): boolean {
	const children = items[ancestorId]?.children ?? [];
	for (const childId of children) {
		if (childId === nodeId || isDescendant(items, childId, nodeId)) return true;
	}
	return false;
}
