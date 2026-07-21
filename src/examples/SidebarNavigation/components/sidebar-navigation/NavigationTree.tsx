import { SidebarGroup, SidebarGroupContent, SidebarMenu } from "ics-ui-kit/components/sidebar";
import { NavigationTreeItem } from "./NavigationTreeItem";
import { NavigationSectionLabel } from "./NavigationSectionLabel";
import { NavigationGroupFirstSlot } from "./NavigationGroupFirstSlot";
import { NavigationGroupLastSlot } from "./NavigationGroupLastSlot";
import { ROOT_ID } from "../../data/navigationData";
import { Layers, Layers2, Layers3 } from "lucide-react";
import { useNavigationTreeStore } from "../../store/navigationTreeStore";
import { DndContext, DragOverlay, MeasuringStrategy, pointerWithin } from "@dnd-kit/core";
import { NavigationDragPreview } from "./sidebar-drag-drop/NavigationDragPreview";
import { useNavigationDnd } from "../../hooks/useNavigationDnd";
import { useHoverBelowContainer } from "../../hooks/useHoverBelowContainer";
import { AfterContainerInsertionLine } from "./sidebar-insertion-line/AfterContainerInsertionLine";
import { useRef } from "react";

const groupIcons = [Layers2, Layers3, Layers];

export function NavigationTree() {
	const items = useNavigationTreeStore((s) => s.items);
	const draggingId = useNavigationTreeStore((s) => s.draggingId);
	const groupIds = items[ROOT_ID]?.children ?? [];

	const containerRef = useRef<HTMLDivElement | null>(null);
	const { sensors, onDragStart, onDragMove, onDragEnd, onDragCancel } = useNavigationDnd(containerRef);
	const { isHoverBelow } = useHoverBelowContainer(containerRef);

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={pointerWithin}
			measuring={{ droppable: { strategy: MeasuringStrategy.Always, frequency: 100 } }}
			onDragStart={onDragStart}
			onDragMove={onDragMove}
			onDragEnd={onDragEnd}
			onDragCancel={onDragCancel}
		>
			<div ref={containerRef} className="nav-tree-root relative mt-4 flex flex-col gap-3">
				{groupIds.map((groupId, index) => {
					const groupData = items[groupId];
					if (!groupData) return null;

					const childIds = groupData.children ?? [];
					return (
						<SidebarGroup key={groupId} className="py-0 pr-4 group-data-[variant=floating]:pr-2.5">
							<NavigationSectionLabel data={groupData} icon={groupIcons[index]} />
							<NavigationGroupFirstSlot groupId={groupId} groupName={groupData.name} />
							<SidebarGroupContent>
								<SidebarMenu className="gap-0.5 pb-0.5">
									{childIds.map((childId) => (
										<NavigationTreeItem key={childId} id={childId} level={1} />
									))}
								</SidebarMenu>
							</SidebarGroupContent>
							<NavigationGroupLastSlot groupId={groupId} />
						</SidebarGroup>
					);
				})}
			</div>
			<AfterContainerInsertionLine
				isVisible={isHoverBelow && !draggingId}
				onAdd={() => console.log("Вставить новую секцию")}
			/>
			<DragOverlay>
				{draggingId && items[draggingId] && <NavigationDragPreview name={items[draggingId].name} />}
			</DragOverlay>
		</DndContext>
	);
}
