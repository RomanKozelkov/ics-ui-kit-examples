import { useDroppable } from "@dnd-kit/core";
import { useNavigationTreeStore } from "../../store/navigationTreeStore";
import { DragInsertionLine } from "./sidebar-drag-drop/DragInsertionLine";

interface NavigationGroupLastSlotProps {
	groupId: string;
}

export function NavigationGroupLastSlot({ groupId }: NavigationGroupLastSlotProps) {
	const droppableId = `${groupId}__last`;
	const { setNodeRef } = useDroppable({ id: droppableId });

	const isDropTarget = useNavigationTreeStore(
		(s) => s.dragTarget?.anchorId === droppableId && s.dragTarget.mode === "last-child"
	);

	return (
		<div ref={setNodeRef} className="pointer-events-none absolute inset-x-2 -bottom-1 z-10 h-2">
			{isDropTarget && <DragInsertionLine />}
		</div>
	);
}
