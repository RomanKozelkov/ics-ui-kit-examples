import { ReactNode } from "react";
import { Item } from "./navigationData";
import {
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSubButton,
	SidebarMenuSubItem
} from "ics-ui-kit/components/sidebar";
import { NavigationItemCounter } from "./NavigationItemCounter";
import { NavigationTreeItemActions } from "./NavigationTreeItemActions";
import { TextOverflowTooltip } from "ics-ui-kit/components/overflow-tooltip";

export function SideMenuItemContent({
	id,
	isNested,
	data,
	isSelected,
	onSelect,
	trigger
}: {
	id: string;
	isNested: boolean;
	data: Item;
	isSelected: boolean;
	onSelect: (id: string) => void;
	trigger?: ReactNode;
}) {
	const ItemWrapper = (isNested ? SidebarMenuSubItem : SidebarMenuItem) as React.ForwardRefExoticComponent<any>;
	const ButtonComponent = (
		isNested ? SidebarMenuSubButton : SidebarMenuButton
	) as React.ForwardRefExoticComponent<any>;

	return (
		<ItemWrapper className="hover:cursor-pointer">
			<ButtonComponent
				type="button"
				onClick={() => onSelect(id)}
				isActive={isSelected}
				className="group/nav h-7 py-1.5 pr-1.5 data-[active=true]:font-medium"
			>
				<TextOverflowTooltip>{data.name}</TextOverflowTooltip>
				{data.badge != null && <NavigationItemCounter>{data.badge}</NavigationItemCounter>}
				<NavigationTreeItemActions trigger={trigger} />
			</ButtonComponent>
		</ItemWrapper>
	);
}
