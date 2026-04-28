import type { ItemInstance } from "@headless-tree/core";
import {
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem
} from "ics-ui-kit/components/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "ics-ui-kit/components/collapsible";
import { TextOverflowTooltip } from "ics-ui-kit/components/overflow-tooltip";
import type { Item } from "./navigationData";
import { NavigationItemCounter } from "./NavigationItemCounter";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "ics-ui-kit/lib/utils";
import { NavigationTreeItemActions } from "./NavigationTreeItemActions";

interface NavigationTreeItemProps {
	item: ItemInstance<Item>;
}

export function NavigationTreeItem({ item }: NavigationTreeItemProps) {
	const data = item.getItemData();
	const level = item.getItemMeta().level;
	const nested = level > 1;

	if (item.isFolder()) {
		return (
			<NavigationTreeFolderRow item={item} data={data} nested={nested}>
				{item.getChildren().map((child) => (
					<NavigationTreeItem key={child.getId()} item={child} />
				))}
			</NavigationTreeFolderRow>
		);
	}

	return <SideMenuItemContent isNested={nested} item={item} data={data} />;
}

function NavigationTreeFolderRow({
	item,
	data,
	nested,
	children
}: {
	item: ItemInstance<Item>;
	data: Item;
	nested: boolean;
	children: ReactNode;
}) {
	const collapsible = (
		<Collapsible
			open={item.isExpanded()}
			onOpenChange={(open) => {
				if (open) {
					item.expand();
				} else {
					item.collapse();
				}
			}}
		>
			<CollapsibleTrigger asChild>
				<SideMenuItemContent isNested={nested} item={item} data={data} showChevron={item.isFolder()} />
			</CollapsibleTrigger>
			<CollapsibleContent>
				<SidebarMenuSub className="border-none">{children}</SidebarMenuSub>
			</CollapsibleContent>
		</Collapsible>
	);

	if (nested) {
		return <SidebarMenuSubItem>{collapsible}</SidebarMenuSubItem>;
	}

	return <SidebarMenuItem>{collapsible}</SidebarMenuItem>;
}

function SideMenuItemContent({
	isNested,
	item,
	data,
	showChevron = false,
	...props
}: {
	isNested: boolean;
	item: ItemInstance<Item>;
	data: Item;
	showChevron?: boolean;
}) {
	const ItemWrapper = (isNested ? SidebarMenuSubItem : SidebarMenuItem) as React.ForwardRefExoticComponent<any>;
	const ButtonComponent = (
		isNested ? SidebarMenuSubButton : SidebarMenuButton
	) as React.ForwardRefExoticComponent<any>;

	return (
		<ItemWrapper className="group/menu-folder" {...props}>
			<ButtonComponent
				{...item.getProps()}
				isActive={item.isSelected()}
				className="group/nav h-7 py-1.5 data-[active=true]:font-medium"
			>
				<TextOverflowTooltip>{data.name}</TextOverflowTooltip>
				{data.badge != null && <NavigationItemCounter>{data.badge}</NavigationItemCounter>}
				<NavigationTreeItemActions showChevron={showChevron} />
			</ButtonComponent>
		</ItemWrapper>
	);
}
