import { useNavigationTreeStore } from "../store/navigationTreeStore";
import { getParentMap } from "../utils/getParentMap";
import { ROOT_ID } from "../data/navigationData";

export function useInsertionLine(id: string, level: number, isFolder: boolean, open: boolean) {
	const items = useNavigationTreeStore((s) => s.items);
	const setHover = useNavigationTreeStore((s) => s.setHover);
	const showsLine = useNavigationTreeStore((s) => {
		const { hoveredParentId, hoveredAnchorId } = s;
		if (!hoveredParentId || !hoveredAnchorId) return false;
		if (s.items[ROOT_ID]?.children?.includes(hoveredParentId)) return false;
		const siblings = s.items[hoveredParentId]?.children;
		if (!siblings) return false;
		const myIndex = siblings.indexOf(id);
		if (myIndex < 0) return false;
		const anchorIndex = siblings.indexOf(hoveredAnchorId);
		return anchorIndex >= 0 && myIndex <= anchorIndex;
	});

	const isOpenFolder = isFolder && open;
	const parentMap = getParentMap(items);

	let minDepth = 1;
	let maxDepth: number;
	let getParentId: (targetDepth: number) => string | null;

	if (isOpenFolder) {
		minDepth = level + 1;
		maxDepth = level + 1;
		getParentId = () => id;
	} else {
		let curId = id;
		let curLevel = level;
		while (curLevel > 1) {
			const pid = parentMap[curId];
			if (!pid) break;
			const siblings = items[pid]?.children ?? [];
			if (siblings.at(-1) !== curId) {
				minDepth = curLevel;
				break;
			}
			curId = pid;
			curLevel--;
		}
		maxDepth = level + 1;
		getParentId = (targetDepth) => {
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
		};
	}

	const handleParentHover = (depth: number | null) => {
		if (depth === null) setHover(null, null);
		else setHover(getParentId(depth), getParentId(depth + 1));
	};

	const handleAdd = (targetDepth: number) => {
		const parentId = getParentId(targetDepth);
		const parentName = parentId ? items[parentId]?.name : undefined;
		console.log(`Вставить в "${parentName}" после "${items[id]?.name}"`);
	};

	return { minDepth, maxDepth, handleAdd, handleParentHover, showsLine };
}
