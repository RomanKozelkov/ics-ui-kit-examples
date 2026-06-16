import type { GroupField, PreparedPromoItem } from "../types";

export type GroupNode = {
	key: string;
	path: string;
	field: GroupField;
	label: string;
	count: number;
	children: GroupNode[];
	lanes: PreparedPromoItem[][];
};

const ROOT_PATH = "__root";

/** Дерево считается сгруппированным, если есть >1 узла верхнего уровня или у корня есть дети. */
export function isGrouped(groups: GroupNode[]): boolean {
	return groups.length > 1 || (groups[0]?.children.length ?? 0) > 0;
}

export function buildGroupTree(items: PreparedPromoItem[], groupBy: GroupField[], rootLabel: string): GroupNode[] {
	if (groupBy.length === 0) {
		return [
			{
				key: ROOT_PATH,
				path: ROOT_PATH,
				field: "channelType",
				label: rootLabel,
				count: items.length,
				children: [],
				lanes: assignLanes(items)
			}
		];
	}
	return buildLevel(items, groupBy, 0, ROOT_PATH);
}

function buildLevel(items: PreparedPromoItem[], fields: GroupField[], depth: number, parentPath: string): GroupNode[] {
	const field = fields[depth];
	const buckets = new Map<string, PreparedPromoItem[]>();

	for (const item of items) {
		const key = String(item[field] ?? "—");
		const bucket = buckets.get(key);
		if (bucket) bucket.push(item);
		else buckets.set(key, [item]);
	}

	const nodes: GroupNode[] = [];
	for (const [key, bucketItems] of buckets) {
		const path = `${parentPath}/${field}=${key}`;
		const isLeaf = depth === fields.length - 1;
		nodes.push({
			key,
			path,
			field,
			label: key,
			count: bucketItems.length,
			children: isLeaf ? [] : buildLevel(bucketItems, fields, depth + 1, path),
			lanes: isLeaf ? assignLanes(bucketItems) : []
		});
	}

	nodes.sort((a, b) => a.label.localeCompare(b.label, "ru"));
	return nodes;
}

// Greedy lane partitioning. Items in same lane never overlap.
function assignLanes(items: PreparedPromoItem[]): PreparedPromoItem[][] {
	const sorted = [...items].sort((a, b) => a.startMs - b.startMs);
	const lanes: { endMs: number; items: PreparedPromoItem[] }[] = [];

	for (const item of sorted) {
		const lane = lanes.find((l) => l.endMs <= item.startMs);
		if (lane) {
			lane.items.push(item);
			lane.endMs = item.endMs;
		} else {
			lanes.push({ endMs: item.endMs, items: [item] });
		}
	}

	return lanes.map((l) => l.items);
}
