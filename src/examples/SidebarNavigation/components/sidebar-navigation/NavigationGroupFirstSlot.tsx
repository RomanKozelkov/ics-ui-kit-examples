import { useDroppable } from "@dnd-kit/core";
import { useNavigationTreeStore } from "../../store/navigationTreeStore";
import { SidebarInsertionLine } from "./sidebar-insertion-line/SidebarInsertionLine";
import { DragInsertionLine } from "./sidebar-drag-drop/DragInsertionLine";

interface NavigationGroupFirstSlotProps {
	groupId: string;
	groupName: string;
}

export function NavigationGroupFirstSlot({ groupId, groupName }: NavigationGroupFirstSlotProps) {
	const droppableId = `${groupId}__first`;
	const { setNodeRef } = useDroppable({ id: droppableId });
	const isDropTarget = useNavigationTreeStore(
		(s) => s.dragTarget?.anchorId === droppableId && s.dragTarget.mode === "first-child"
	);

	return (
		<div className="relative">
			<SidebarInsertionLine
				minDepth={1}
				maxDepth={1}
				level={1}
				className="-bottom-[0.1875rem]"
				onAdd={() => {
					console.log(`Вставить в "${groupName}" первым элементом`);
				}}
			/>
			<div ref={setNodeRef} className="pointer-events-none absolute inset-x-0 z-10 h-2">
				{isDropTarget && <DragInsertionLine className="bottom-auto top-0 -translate-y-1/2" />}
			</div>
		</div>
	);
}
