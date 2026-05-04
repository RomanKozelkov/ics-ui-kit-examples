import type { ItemInstance } from "@headless-tree/core";
import { SidebarMenuSub } from "ics-ui-kit/components/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "ics-ui-kit/components/collapsible";
import type { Item } from "./navigationData";
import type { ReactNode } from "react";
import { SideMenuItemContent } from "./SideMenuItemContent";
import { Icon } from "ics-ui-kit/components/icon";
import { ChevronRight } from "lucide-react";
import { cn } from "ics-ui-kit/lib/utils";

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
	return (
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
								className={cn(
									"shrink-0 stroke-[2.5] text-muted transition-transform group-hover/actions:text-primary-fg",
									item.isExpanded() && "rotate-90"
								)}
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
}
