import { useNavigationTreeStore } from "../store/navigationTreeStore";

export function useDragLineState(id: string) {
	const showsDragLine = useNavigationTreeStore((s) => {
		const { dragTarget } = s;
		if (!dragTarget || dragTarget.mode !== "after") return false;
		const { anchorId, parentId } = dragTarget;
		if (!parentId) return false;
		if (s.items[parentId] === undefined) return false;
		const siblings = s.items[parentId]?.children;
		if (!siblings) return false;
		const myIndex = siblings.indexOf(id);
		if (myIndex < 0) return false;
		const anchorIndex = siblings.indexOf(anchorId);
		return anchorIndex >= 0 && myIndex <= anchorIndex;
	});
	const isDragAnchor = useNavigationTreeStore((s) => s.dragTarget?.mode === "after" && s.dragTarget.anchorId === id);

	return { showsDragLine, isDragAnchor };
}
