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

	return (
		<ItemWrapper className="relative hover:cursor-pointer">
			{indicator}
			<ButtonComponent
				type="button"
				onClick={() => onSelect(id)}
				isActive={isSelected}
				className={cn(
					"group/nav h-7 py-1.5 pr-1.5 data-[active=true]:font-medium",
					isInsertionTarget && "bg-secondary-bg-hover"
				)}
			>
				<TextOverflowTooltip>{data.name}</TextOverflowTooltip>
				{data.badge != null && <NavigationItemCounter>{data.badge}</NavigationItemCounter>}
				<NavigationTreeItemActions trigger={trigger} />
			</ButtonComponent>
		</ItemWrapper>
	);
}
