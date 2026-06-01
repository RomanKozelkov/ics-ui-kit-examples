import { SidebarGroup, SidebarGroupContent, SidebarMenu } from "ics-ui-kit/components/sidebar";
import { NavigationTreeItem } from "./NavigationTreeItem";
import { NavigationSectionLabel } from "./NavigationSectionLabel";
import { ROOT_ID } from "../../data/navigationData";
import { Layers, Layers2, Layers3 } from "lucide-react";
import { SidebarInsertionLine } from "./sidebar-insertion-line/SidebarInsertionLine";
import { useNavigationTreeStore } from "../../store/navigationTreeStore";
import { DndContext, DragOverlay, pointerWithin } from "@dnd-kit/core";
import { NavigationDragPreview } from "./sidebar-drag-drop/NavigationDragPreview";
import { useNavigationDnd } from "../../hooks/useNavigationDnd";

const groupIcons = [Layers2, Layers3, Layers];

export function NavigationTree() {
	const items = useNavigationTreeStore((s) => s.items);
	const draggingId = useNavigationTreeStore((s) => s.draggingId);
	const groupIds = items[ROOT_ID]?.children ?? [];

	const { sensors, onPointerMove, onDragStart, onDragMove, onDragEnd, onDragCancel } = useNavigationDnd();

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={pointerWithin}
			onDragStart={onDragStart}
			onDragMove={onDragMove}
			onDragEnd={onDragEnd}
			onDragCancel={onDragCancel}
		>
			<div className="relative mt-4 flex flex-col gap-3" onPointerMove={onPointerMove}>
				{groupIds.map((groupId, index) => {
					const groupData = items[groupId];
					if (!groupData) return null;

					const childIds = groupData.children ?? [];
					return (
						<SidebarGroup key={groupId} className="py-0 pr-4 group-data-[variant=floating]:pr-2.5">
							<div className="relative">
								<NavigationSectionLabel data={groupData} icon={groupIcons[index]} />
								<SidebarInsertionLine
									minDepth={1}
									maxDepth={1}
									level={1}
									onAdd={() => {
										console.log(`Вставить в "${groupData.name}" первым элементом`);
									}}
								/>
							</div>
							<SidebarGroupContent>
								<SidebarMenu className="gap-0.5 pb-0.5">
									{childIds.map((childId) => (
										<NavigationTreeItem key={childId} id={childId} level={1} />
									))}
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
					);
				})}
			</div>
			<DragOverlay>
				{draggingId && items[draggingId] && <NavigationDragPreview name={items[draggingId].name} />}
			</DragOverlay>
		</DndContext>
	);
}
