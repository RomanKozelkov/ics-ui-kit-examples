import {
	SidebarGroupLabel,
	SidebarMenuButton
} from "ics-ui-kit/components/sidebar";
import { NavigationItemCounter } from "./NavigationItemCounter";
import { IconButton } from "ics-ui-kit/components/button";
import { EllipsisVertical, Plus } from "lucide-react";
import type { Item } from "./navigationData";
import { TextOverflowTooltip } from "ics-ui-kit/components/overflow-tooltip";
import { Palette } from "lucide-react";

interface NavigationSectionLabelProps {
	data: Item;
}

export function NavigationSectionLabel({ data }: NavigationSectionLabelProps) {
	return (
		<SidebarMenuButton className="group/label h-8 pl-2 pr-0 gap-2 rounded-md mb-0.5 text-secondary-fg opacity-70 hover:bg-secondary-bg-hover hover:text-fg-hover cursor-pointer">
			<Palette className="size-4" />
			<TextOverflowTooltip className="flex-1 text-xs font-medium">
				{data.name}
			</TextOverflowTooltip>
			{data.badge != null && (
				<NavigationItemCounter>{data.badge}</NavigationItemCounter>
			)}
			<span className="hidden items-center group-hover/label:flex">
				<IconButton icon={Plus} size="xs" variant="ghost" />
				<IconButton icon={EllipsisVertical} size="xs" variant="ghost" />
			</span>
		</SidebarMenuButton>
	);
}
