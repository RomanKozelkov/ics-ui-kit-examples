import { useDraggable, useDroppable } from "@dnd-kit/core";
import { useDndState } from "../components/sidebar-navigation/dnd/DndStateContext";

export function useDragDrop(id: string) {
	const { attributes, listeners, setNodeRef: setDragRef } = useDraggable({ id });
	const { setNodeRef: setDropRef } = useDroppable({ id });
	const { activeId, dropZone } = useDndState();

	const combinedRef = (node: HTMLElement | null) => {
		setDragRef(node);
		setDropRef(node);
	};

	return {
		combinedRef,
		listeners,
		attributes,
		isPlaceholder: activeId === id,
		isDropTarget: dropZone?.targetId === id && dropZone.position === "child",
		isInsertAfter: dropZone?.targetId === id && (dropZone.position === "after" || dropZone.position === "before"),
		isDraggingAny: !!activeId
	};
}
