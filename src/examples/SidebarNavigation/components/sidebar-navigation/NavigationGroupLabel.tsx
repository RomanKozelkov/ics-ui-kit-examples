import { useDroppable } from "@dnd-kit/core";
import { useNavigationTreeStore } from "../../store/navigationTreeStore";
import { SidebarInsertionLine } from "./sidebar-insertion-line/SidebarInsertionLine";
import { DragInsertionLine } from "./sidebar-drag-drop/DragInsertionLine";
import { Item } from "../../data/navigationData";
import { LucideIcon } from "lucide-react";
import { NavigationSectionLabel } from "./NavigationSectionLabel";

interface NavigationGroupLabelProps {
	groupId: string;
	groupData: Item;
	icon: LucideIcon;
}

export function NavigationGroupLabel({ groupId, groupData, icon }: NavigationGroupLabelProps) {
	const { setNodeRef } = useDroppable({ id: groupId });
	const isDropAfter = useNavigationTreeStore(
		(s) => s.dragTarget?.anchorId === groupId && s.dragTarget.mode === "after"
	);

	return (
		<div ref={setNodeRef} className="relative">
			<NavigationSectionLabel data={groupData} icon={icon} />

			<SidebarInsertionLine
				minDepth={1}
				maxDepth={1}
				level={1}
				className="-bottom-[0.1875rem]"
				onAdd={() => {
					console.log(`Вставить в "${groupData.name}" первым элементом`);
				}}
			/>
			{isDropAfter && <DragInsertionLine />}
		</div>
	);
}
