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
import { OverflowTooltip, TextOverflowTooltip } from "ics-ui-kit/components/overflow-tooltip";
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
				data-highlighted={isHighlighted || undefined}
				className={cn(
					"group/nav h-7 gap-1 py-1.5 pr-1.5 data-[active=true]:font-medium !rounded-lg",
					"hover:!bg-secondary-border data-[active=true]:!bg-primary-border data-[active=true]:hover:!bg-primary-border",
					isHighlighted && "!bg-secondary-border"
				)}
				{...dragListeners}
				{...dragAttributes}
			>
				<span className="flex min-w-0 flex-1 items-center gap-2 group-hover/nav:pr-12">
					<OverflowTooltip className="inline-block min-w-0 truncate" focus="high">
						{data.name}
					</OverflowTooltip>
					{data.badge != null && <NavigationItemCounter>{data.badge}</NavigationItemCounter>}
					{trigger}
				</span>
				<NavigationTreeItemActions />
			</ButtonComponent>
		</ItemWrapper>
	);
}
