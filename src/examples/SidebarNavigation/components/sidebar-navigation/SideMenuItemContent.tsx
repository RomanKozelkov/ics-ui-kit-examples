import { ReactNode } from "react";
import { Item } from "../../data/navigationData";
import { SidebarMenuButton, SidebarMenuItem } from "ics-ui-kit/components/sidebar";
import { NavigationItemCounter } from "./NavigationItemCounter";
import { NavigationTreeItemActions } from "./NavigationTreeItemActions";
import { TextOverflowTooltip } from "ics-ui-kit/components/overflow-tooltip";
import { INDENT_SIDEBAR_ITEM_WIDTH } from "../../utils/constants";
import { cn } from "ics-ui-kit/lib/utils";
import { useDragDrop } from "../../hooks/useDragDrop";

export function SideMenuItemContent({
	id,
	level,
	data,
	isSelected,
	onSelect,
	trigger,
	indicator
}: {
	id: string;
	level: number;
	data: Item;
	isSelected: boolean;
	onSelect: (id: string) => void;
	trigger?: ReactNode;
	indicator?: ReactNode;
}) {
	const paddingLeft = (level - 1) * INDENT_SIDEBAR_ITEM_WIDTH;
	const { isPlaceholder, listeners, attributes, isDraggingAny, isDropTarget } = useDragDrop(id);

	return (
		<SidebarMenuItem
			className="relative hover:cursor-pointer"
			style={{ paddingLeft: paddingLeft > 0 ? paddingLeft : undefined }}
		>
			{indicator}
			<SidebarMenuButton
				type="button"
				onClick={() => onSelect(id)}
				isActive={isSelected}
				className={cn(
					"group/nav h-7 py-1.5 pr-1.5 data-[active=true]:font-medium",
					isDraggingAny && "cursor-grabbing",
					isPlaceholder && "pointer-events-none opacity-50",
					isDropTarget && "bg-secondary-bg-hover"
				)}
				{...listeners}
				{...attributes}
			>
				<TextOverflowTooltip>{data.name}</TextOverflowTooltip>
				{data.badge != null && <NavigationItemCounter>{data.badge}</NavigationItemCounter>}
				<NavigationTreeItemActions trigger={trigger} />
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
}
