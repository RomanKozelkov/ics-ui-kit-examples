import { useMemo } from "react";
import { useNavigationTreeStore } from "../store/navigationTreeStore";
import { getParentMap } from "../utils/getParentMap";
import { getMinInsertionDepth, getParentIdAtDepth } from "../utils/sidebarInsertionLineUtils";
import { ROOT_ID } from "../data/navigationData";

export function useInsertionLineState(id: string, level: number, isFolder: boolean, open: boolean) {
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
	const isAnchor = useNavigationTreeStore((s) => s.hoveredAnchorId === id);

	const isOpenFolder = isFolder && open;
	const parentMap = useMemo(() => getParentMap(items), [items]);

	const minDepth = isOpenFolder ? level + 1 : getMinInsertionDepth(id, level, items, parentMap);
	const maxDepth = level + 1;

	const getParentId = (targetDepth: number): string | null => {
		if (isOpenFolder) return id;
		return getParentIdAtDepth(id, level, targetDepth, parentMap);
	};

	const handleParentHover = (depth: number | null) => {
		if (depth === null) setHover(null, null);
		else setHover(getParentId(depth), getParentId(depth + 1));
	};

	const handleAdd = (targetDepth: number) => {
		const parentId = getParentId(targetDepth);
		const parentName = parentId ? items[parentId]?.name : undefined;
		console.log(`Вставить в "${parentName}" после "${items[id]?.name}"`);
	};

	return { minDepth, maxDepth, handleAdd, handleParentHover, showsLine, isAnchor };
}
