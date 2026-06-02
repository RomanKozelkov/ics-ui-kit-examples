import { SidebarGroup, SidebarGroupContent, SidebarMenu } from "ics-ui-kit/components/sidebar";
import { NavigationTreeItem } from "./NavigationTreeItem";
import { NavigationSectionLabel } from "./NavigationSectionLabel";
import { NavigationGroupLabel } from "./NavigationGroupLabel";
import { ROOT_ID } from "../../data/navigationData";
import { Layers, Layers2, Layers3 } from "lucide-react";
import { useNavigationTreeStore } from "../../store/navigationTreeStore";
import { DndContext, DragOverlay, pointerWithin } from "@dnd-kit/core";
import { NavigationDragPreview } from "./sidebar-drag-drop/NavigationDragPreview";
import { useNavigationDnd } from "../../hooks/useNavigationDnd";

const groupIcons = [Layers2, Layers3, Layers];

export function NavigationTree() {
	const items = useNavigationTreeStore((s) => s.items);
	const draggingId = useNavigationTreeStore((s) => s.draggingId);
	const groupIds = items[ROOT_ID]?.children ?? [];

	const { sensors, onDragStart, onDragMove, onDragEnd, onDragCancel } = useNavigationDnd();

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={pointerWithin}
			onDragStart={onDragStart}
			onDragMove={onDragMove}
			onDragEnd={onDragEnd}
			onDragCancel={onDragCancel}
		>
			<div className="relative mt-4 flex flex-col gap-3">
				{groupIds.map((groupId, index) => {
					const groupData = items[groupId];
					if (!groupData) return null;

					const childIds = groupData.children ?? [];
					return (
						<SidebarGroup key={groupId} className="py-0 pr-4 group-data-[variant=floating]:pr-2.5">
							<NavigationGroupLabel groupId={groupId} groupData={groupData} icon={groupIcons[index]} />
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
