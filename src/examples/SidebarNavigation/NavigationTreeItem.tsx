import type { ItemInstance } from "@headless-tree/core";
import { SidebarMenuButton, SidebarMenuItem } from "ics-ui-kit/components/sidebar";
import { TextOverflowTooltip } from "ics-ui-kit/components/overflow-tooltip";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import type { Item } from "./navigationData";
import { NavigationItemCounter } from "./NavigationItemCounter";
import { Icon } from "ics-ui-kit/components/icon";
import { cn } from "ics-ui-kit/lib/utils";

const INDENT = 24;

interface NavigationTreeItemProps {
	item: ItemInstance<Item>;
}

export function NavigationTreeItem({ item }: NavigationTreeItemProps) {
	const data = item.getItemData();
	const depth = item.getItemMeta().level - 1;

	return (
		<SidebarMenuItem>
			<SidebarMenuButton
				{...item.getProps()}
				isActive={item.isSelected()}
				className="group/nav h-7 py-1.5 data-[active=true]:font-medium"
				style={{
					paddingInlineStart: 8 + depth * INDENT
				}}
			>
				<TextOverflowTooltip>{data.name}</TextOverflowTooltip>
				{data.badge != null && <NavigationItemCounter>{data.badge}</NavigationItemCounter>}
				<span className="ml-auto flex items-center gap-1">
					<button
						type="button"
						className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hidden size-5 items-center justify-center rounded text-muted-foreground group-hover/nav:flex group-data-[active=true]/nav:flex"
						onClick={(e) => e.stopPropagation()}
					>
						<Icon icon={MoreHorizontal} className="size-3.5" />
					</button>
					{item.isFolder() && (
						<span className="flex size-4 items-center justify-center text-muted-foreground hover:text-primary-fg">
							<Icon
								icon={ChevronRight}
								size="sm"
								className={cn("shrink-0 transition-transform", item.isExpanded() ? "rotate-90" : "")}
							/>
						</span>
					)}
				</span>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
}
