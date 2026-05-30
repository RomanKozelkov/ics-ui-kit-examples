import { ROOT_ID } from "../data/navigationData";
import { useNavigationTreeStore } from "../store/navigationTreeStore";

export function useShowsInsertionLine(id: string): boolean {
	return useNavigationTreeStore((s) => {
		const { hoveredParentId, hoveredAnchorId, items } = s;
		if (!hoveredParentId || !hoveredAnchorId) return false;
		const isLabelLevel = items[ROOT_ID]?.children?.includes(hoveredParentId);
		if (isLabelLevel) return false;
		const siblings = items[hoveredParentId]?.children;
		if (!siblings) return false;
		const myIndex = siblings.indexOf(id);
		if (myIndex < 0) return false;
		const anchorIndex = siblings.indexOf(hoveredAnchorId);
		return anchorIndex >= 0 && myIndex <= anchorIndex;
	});
}
