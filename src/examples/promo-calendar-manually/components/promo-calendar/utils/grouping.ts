import { assignLanes } from "./lanes";
import type { GroupField, PreparedPromo } from "../types";

export type GroupNode = {
	path: string; // уникальный ключ ветки — используется для свёрнутости
	field: GroupField;
	label: string;
	count: number;
	depth: number;
	children: GroupNode[]; // непустой у промежуточных уровней
	lanes: PreparedPromo[][]; // непустой только у листа
};

const ROOT_PATH = "__root";

/**
 * Строит дерево группировки. Пустой groupBy ⇒ один корень со всеми дорожками без шапки.
 * Иначе — вложенные секции по уровням (ordered), листовой уровень держит дорожки.
 */
export function buildGroupTree(items: PreparedPromo[], groupBy: GroupField[]): GroupNode[] {
	if (groupBy.length === 0) {
		return [
			{
				path: ROOT_PATH,
				field: "channelType",
				label: "Все промо",
				count: items.length,
				depth: 0,
				children: [],
				lanes: assignLanes(items)
			}
		];
	}
	return buildLevel(items, groupBy, 0, ROOT_PATH);
}

function buildLevel(items: PreparedPromo[], fields: GroupField[], depth: number, parentPath: string): GroupNode[] {
	const field = fields[depth];
	const isLeaf = depth === fields.length - 1;
	const buckets = new Map<string, PreparedPromo[]>();

	for (const item of items) {
		const key = String(item[field] ?? "—");
		const bucket = buckets.get(key);
		if (bucket) bucket.push(item);
		else buckets.set(key, [item]);
	}

	const nodes: GroupNode[] = [];
	for (const [key, bucketItems] of buckets) {
		const path = `${parentPath}/${field}=${key}`;
		nodes.push({
			path,
			field,
			label: key,
			count: bucketItems.length,
			depth,
			children: isLeaf ? [] : buildLevel(bucketItems, fields, depth + 1, path),
			lanes: isLeaf ? assignLanes(bucketItems) : []
		});
	}

	nodes.sort((a, b) => a.label.localeCompare(b.label, "ru"));
	return nodes;
}
