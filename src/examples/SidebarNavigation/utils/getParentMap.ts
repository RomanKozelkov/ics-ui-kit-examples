import { Item } from "../data/navigationData";

export type ParentMap = Record<string, string>;

export function getParentMap(items: Record<string, Item>): ParentMap {
	const map: ParentMap = {};
	for (const [id, item] of Object.entries(items)) {
		for (const childId of item.children ?? []) {
			map[childId] = id;
		}
	}
	return map;
}
