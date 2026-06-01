import { ReactNode } from "react";
import { cn } from "ics-ui-kit/lib/utils";
import { Item } from "../../data/navigationData";
import {
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSubButton,
	SidebarMenuSubItem
} from "ics-ui-kit/components/sidebar";
import { NavigationItemCounter } from "./NavigationItemCounter";
import { NavigationTreeItemActions } from "./NavigationTreeItemActions";
import { TextOverflowTooltip } from "ics-ui-kit/components/overflow-tooltip";
import { useNavigationTreeStore } from "../../store/navigationTreeStore";
import { useDraggable } from "@dnd-kit/core";

export function SideMenuItemContent({
	id,
	isNested,
	data,
	isSelected,
	onSelect,
	trigger,
	indicator
}: {
	id: string;
	isNested: boolean;
	data: Item;
	isSelected: boolean;
	onSelect: (id: string) => void;
	trigger?: ReactNode;
	indicator?: ReactNode;
}) {
	const ItemWrapper = isNested ? SidebarMenuSubItem : SidebarMenuItem;
	const ButtonComponent = isNested ? SidebarMenuSubButton : SidebarMenuButton;

	const isInsertionTarget = useNavigationTreeStore((s) => s.hoveredParentId === id);
	const isDragging = useNavigationTreeStore((s) => s.draggingId === id);
	const isDragTarget = useNavigationTreeStore(
		(s) => (s.dragTarget?.anchorId === id && s.dragTarget.mode === "into") || s.dragTarget?.parentId === id
	);

	const { attributes, listeners, setNodeRef: setDraggableRef } = useDraggable({ id });

	return (
		<ItemWrapper ref={setDraggableRef} className={cn("relative hover:cursor-pointer", isDragging && "opacity-50")}>
			{indicator}
			<ButtonComponent
				type="button"
				onClick={() => onSelect(id)}
				isActive={isSelected}
				className={cn(
					"group/nav h-7 py-1.5 pr-1.5 data-[active=true]:font-medium",
					(isInsertionTarget || isDragTarget) && "bg-secondary-bg-hover"
				)}
				{...listeners}
				{...attributes}
			>
				<TextOverflowTooltip>{data.name}</TextOverflowTooltip>
				{data.badge != null && <NavigationItemCounter>{data.badge}</NavigationItemCounter>}
				<NavigationTreeItemActions trigger={trigger} />
			</ButtonComponent>
		</ItemWrapper>
	);
}
