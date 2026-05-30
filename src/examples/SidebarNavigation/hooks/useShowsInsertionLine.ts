import { useNavigationTreeStore } from "../store/navigationTreeStore";

/**
 * Returns true if this item lies on the visual path between the currently
 * hovered insertion parent and the hover anchor — i.e. should render
 * the vertical connector line on its row.
 */
export function useShowsInsertionLine(id: string): boolean {
	return useNavigationTreeStore((s) => {
		const { hoveredParentId, hoveredAnchorId, items } = s;
		if (!hoveredParentId || !hoveredAnchorId) return false;
		const siblings = items[hoveredParentId]?.children;
		if (!siblings) return false;
		const myIndex = siblings.indexOf(id);
		if (myIndex < 0) return false;
		const anchorIndex = siblings.indexOf(hoveredAnchorId);
		return anchorIndex >= 0 && myIndex <= anchorIndex;
	});
}
