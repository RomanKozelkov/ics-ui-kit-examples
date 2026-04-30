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
import type { ReactNode } from "react";
import { NavigationTreeItemActions } from "./NavigationTreeItemActions";
import { Icon } from "ics-ui-kit/components/icon";
import { ChevronRight } from "lucide-react";

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
			<SideMenuItemContent
				isNested={nested}
				item={item}
				data={data}
				trigger={
					<CollapsibleTrigger asChild>
						<span className="group/actions flex size-4 items-center justify-center text-muted-foreground">
							<Icon
								icon={ChevronRight}
								size="sm"
								className="shrink-0 stroke-[2.5] text-muted transition-transform group-hover/actions:text-primary-fg group-data-[state=open]/menu-folder:rotate-90"
							/>
						</span>
					</CollapsibleTrigger>
				}
			/>
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

	return (
		<ItemWrapper className="group/menu-folder hover:cursor-pointer" {...props}>
			<ButtonComponent
				{...item.getProps()}
				isActive={item.isSelected()}
				className="group/nav h-7 py-1.5 hover:font-medium data-[active=true]:font-medium"
			>
				<TextOverflowTooltip>{data.name}</TextOverflowTooltip>
				{data.badge != null && <NavigationItemCounter>{data.badge}</NavigationItemCounter>}
				<NavigationTreeItemActions trigger={trigger} />
			</ButtonComponent>
		</ItemWrapper>
	);
}
