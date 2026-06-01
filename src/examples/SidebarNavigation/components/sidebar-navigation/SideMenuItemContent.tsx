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
import type { DraggableAttributes, DraggableSyntheticListeners } from "@dnd-kit/core";

export function SideMenuItemContent({
	isNested,
	data,
	isSelected,
	onSelect,
	trigger,
	indicator,
	isDragging,
	isHighlighted,
	draggableRef,
	dragListeners,
	dragAttributes
}: {
	isNested: boolean;
	data: Item;
	isSelected: boolean;
	onSelect: () => void;
	trigger?: ReactNode;
	indicator?: ReactNode;
	isDragging?: boolean;
	isHighlighted?: boolean;
	draggableRef?: (el: HTMLElement | null) => void;
	dragListeners?: DraggableSyntheticListeners;
	dragAttributes?: DraggableAttributes;
}) {
	const ItemWrapper = isNested ? SidebarMenuSubItem : SidebarMenuItem;
	const ButtonComponent = isNested ? SidebarMenuSubButton : SidebarMenuButton;

	return (
		<ItemWrapper ref={draggableRef} className={cn("relative hover:cursor-pointer", isDragging && "opacity-50")}>
			{indicator}
			<ButtonComponent
				type="button"
				onClick={onSelect}
				isActive={isSelected}
				className={cn(
					"group/nav h-7 py-1.5 pr-1.5 data-[active=true]:font-medium",
					isHighlighted && "bg-secondary-bg-hover"
				)}
				{...dragListeners}
				{...dragAttributes}
			>
				<TextOverflowTooltip>{data.name}</TextOverflowTooltip>
				{data.badge != null && <NavigationItemCounter>{data.badge}</NavigationItemCounter>}
				<NavigationTreeItemActions trigger={trigger} />
			</ButtonComponent>
		</ItemWrapper>
	);
}
