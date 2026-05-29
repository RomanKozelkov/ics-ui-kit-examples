import { SidebarMenuButton, SidebarMenuItem } from "ics-ui-kit/components/sidebar";
import { TextOverflowTooltip } from "ics-ui-kit/components/overflow-tooltip";
import type { Item } from "../../../data/navigationData";

export function DraggedItemPreview({ data }: { data: Item }) {
	return (
		<SidebarMenuItem className="w-44 rounded-md bg-secondary-bg opacity-85 shadow-md">
			<SidebarMenuButton className="h-7 cursor-grabbing py-1.5 pr-1.5 font-medium">
				<TextOverflowTooltip>{data.name}</TextOverflowTooltip>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
}
