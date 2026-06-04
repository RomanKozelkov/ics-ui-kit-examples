import { useDraggable, useDroppable } from "@dnd-kit/core";
import { useNavigationTreeStore } from "../store/navigationTreeStore";

export function useItemDndState(id: string) {
	const isDragging = useNavigationTreeStore((s) => s.draggingId === id);
	const isInsertionTarget = useNavigationTreeStore((s) => s.hoveredParentId === id);
	const isDragTarget = useNavigationTreeStore(
		(s) => (s.dragTarget?.anchorId === id && s.dragTarget.mode === "into") || s.dragTarget?.parentId === id
	);
	const dropMode = useNavigationTreeStore((s) => s.dragTarget?.anchorId === id && s.dragTarget.mode);
	const isDropAfter = useNavigationTreeStore((s) => s.dragTarget?.anchorId === id && s.dragTarget.mode === "after");

	const { setNodeRef: setDroppableRef } = useDroppable({ id });
	const { attributes, listeners, setNodeRef: setDraggableRef } = useDraggable({ id });

	return {
		isDragging,
		isInsertionTarget,
		isDragTarget,
		dropMode,
		isDropAfter,
		setDroppableRef,
		setDraggableRef,
		dragListeners: listeners,
		dragAttributes: attributes
	};
}
