import type { ItemInstance } from "@headless-tree/core";
import type { Item } from "./navigationData";
import {
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSubButton,
	SidebarMenuSubItem
} from "ics-ui-kit/components/sidebar";
import { TextOverflowTooltip } from "ics-ui-kit/components/overflow-tooltip";
import { NavigationItemCounter } from "./NavigationItemCounter";
import { NavigationTreeItemActions } from "./NavigationTreeItemActions";
import type { ReactNode } from "react";

export function SideMenuItemContent({
	isNested,
	item,
	data,
	trigger,
	...props
}: {
	isNested: boolean;
	item: ItemInstance<Item>;
	data: Item;
	trigger?: ReactNode;
}) {
	const ItemWrapper = (isNested ? SidebarMenuSubItem : SidebarMenuItem) as React.ForwardRefExoticComponent<any>;
	const ButtonComponent = (
		isNested ? SidebarMenuSubButton : SidebarMenuButton
	) as React.ForwardRefExoticComponent<any>;

	const { onClick: _treeRowClick, ...treeRest } = item.getProps();
	const tree = item.getTree();

	return (
		<ItemWrapper className="hover:cursor-pointer" {...props}>
			<ButtonComponent
				{...treeRest}
				isActive={item.isSelected()}
				className="group/nav h-7 py-1.5 hover:font-medium data-[active=true]:font-medium"
				onClick={() => tree.setSelectedItems([item.getId()])}
			>
				<TextOverflowTooltip>{data.name}</TextOverflowTooltip>
				{data.badge != null && <NavigationItemCounter>{data.badge}</NavigationItemCounter>}
				<NavigationTreeItemActions trigger={trigger} />
			</ButtonComponent>
		</ItemWrapper>
	);
}
