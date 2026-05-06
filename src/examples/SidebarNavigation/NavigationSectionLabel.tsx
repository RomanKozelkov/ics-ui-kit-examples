import { SidebarGroupLabel } from "ics-ui-kit/components/sidebar";
import { NavigationItemCounter } from "./NavigationItemCounter";
import type { Item } from "./navigationData";
import { TextOverflowTooltip } from "ics-ui-kit/components/overflow-tooltip";
import { Layers3 } from "lucide-react";
import { Icon } from "ics-ui-kit/components/icon";
import type { LucideIcon } from "lucide-react";
import { NavigationTreeItemActions } from "./NavigationTreeItemActions";

interface NavigationSectionLabelProps {
	data: Item;
	icon?: LucideIcon;
}

export function NavigationSectionLabel({ data, icon = Layers3 }: NavigationSectionLabelProps) {
	return (
		<SidebarGroupLabel className="group/nav mb-0.5 h-8 gap-2 p-2 pr-1.5 text-muted hover:bg-secondary-bg-hover hover:text-secondary-fg">
			<Icon icon={icon} />
			<TextOverflowTooltip className="flex-1 text-xs font-medium">{data.name}</TextOverflowTooltip>
			{data.badge != null && <NavigationItemCounter>{data.badge}</NavigationItemCounter>}
			<NavigationTreeItemActions />
		</SidebarGroupLabel>
	);
}
