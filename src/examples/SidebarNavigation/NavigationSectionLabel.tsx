import { SidebarGroupLabel } from "ics-ui-kit/components/sidebar";
import { NavigationItemCounter } from "./NavigationItemCounter";
import type { Item } from "./navigationData";
import { TextOverflowTooltip } from "ics-ui-kit/components/overflow-tooltip";
import { Palette } from "lucide-react";
import { Icon } from "ics-ui-kit/components/icon";

interface NavigationSectionLabelProps {
	data: Item;
}

export function NavigationSectionLabel({ data }: NavigationSectionLabelProps) {
	return (
		<SidebarGroupLabel className="mb-0.5 h-8 gap-2 pl-2 pr-0">
			<Icon icon={Palette} />
			<TextOverflowTooltip className="flex-1 text-xs font-medium">{data.name}</TextOverflowTooltip>
			{data.badge != null && <NavigationItemCounter>{data.badge}</NavigationItemCounter>}
		</SidebarGroupLabel>
	);
}
