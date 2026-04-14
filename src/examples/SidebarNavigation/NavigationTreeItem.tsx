import type { ItemInstance } from "@headless-tree/core";
import {
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem
} from "ics-ui-kit/components/sidebar";
import { TextOverflowTooltip } from "ics-ui-kit/components/overflow-tooltip";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import type { Item } from "./navigationData";
import { NavigationItemCounter } from "./NavigationItemCounter";

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
				className="group/nav py-1.5 data-[active=true]:font-medium"
				style={{
					paddingInlineStart: 8 + depth * INDENT
				}}
			>
				<TextOverflowTooltip>{data.name}</TextOverflowTooltip>
				{data.badge != null && (
					<NavigationItemCounter>{data.badge}</NavigationItemCounter>
				)}
				<span className="ml-auto hidden items-center gap-1 group-hover/nav:flex">
					<button
						type="button"
						className="flex size-5 items-center justify-center rounded text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
						onClick={(e) => e.stopPropagation()}
					>
						<MoreHorizontal className="size-3.5" />
					</button>
					{item.isFolder() && (
						<ChevronRight
							className={
								"size-4 shrink-0 text-muted-foreground transition-transform " +
								(item.isExpanded() ? "rotate-90" : "")
							}
						/>
					)}
				</span>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
}
