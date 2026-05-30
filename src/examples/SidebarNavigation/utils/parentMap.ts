import { Item } from "../data/navigationData";

export type ParentMap = Record<string, string>;

const cache = new WeakMap<Record<string, Item>, ParentMap>();

export function getParentMap(items: Record<string, Item>): ParentMap {
	let map = cache.get(items);
	if (!map) {
		map = buildParentMap(items);
		cache.set(items, map);
	}
	return map;
}

function buildParentMap(items: Record<string, Item>): ParentMap {
	const map: ParentMap = {};
	for (const [id, item] of Object.entries(items)) {
		for (const childId of item.children ?? []) {
			map[childId] = id;
		}
	}
	return map;
}
