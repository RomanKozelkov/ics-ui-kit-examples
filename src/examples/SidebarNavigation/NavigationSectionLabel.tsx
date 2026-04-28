import { SidebarGroupLabel } from "ics-ui-kit/components/sidebar";
import { NavigationItemCounter } from "./NavigationItemCounter";
import type { Item } from "./navigationData";
import { TextOverflowTooltip } from "ics-ui-kit/components/overflow-tooltip";
import { Layers3 } from "lucide-react";
import { Icon } from "ics-ui-kit/components/icon";

interface NavigationSectionLabelProps {
	data: Item;
}

export function NavigationSectionLabel({ data }: NavigationSectionLabelProps) {
	return (
		<SidebarGroupLabel className="mb-0.5 h-8 gap-2 p-2 pr-8">
			<Icon icon={Layers3} />
			<TextOverflowTooltip className="flex-1 text-xs font-medium">{data.name}</TextOverflowTooltip>
			{data.badge != null && <NavigationItemCounter>{data.badge}</NavigationItemCounter>}
		</SidebarGroupLabel>
	);
}
