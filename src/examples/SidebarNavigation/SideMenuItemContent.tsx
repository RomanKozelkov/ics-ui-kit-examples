import { ReactNode } from "react";
import { Item } from "./navigationData";
import { SidebarMenuButton, SidebarMenuItem } from "ics-ui-kit/components/sidebar";
import { NavigationItemCounter } from "./NavigationItemCounter";
import { NavigationTreeItemActions } from "./NavigationTreeItemActions";
import { TextOverflowTooltip } from "ics-ui-kit/components/overflow-tooltip";
import { INDENT_SIDEBAR_ITEM_WIDTH } from "./constants";

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
				className="group/nav h-7 py-1.5 pr-1.5 data-[active=true]:font-medium"
			>
				<TextOverflowTooltip>{data.name}</TextOverflowTooltip>
				{data.badge != null && <NavigationItemCounter>{data.badge}</NavigationItemCounter>}
				<NavigationTreeItemActions trigger={trigger} />
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
}
