import { SidebarGroup, SidebarGroupContent, SidebarMenu } from "ics-ui-kit/components/sidebar";
import { NavigationTreeItem } from "./NavigationTreeItem";
import { NavigationSectionLabel } from "./NavigationSectionLabel";
import { ROOT_ID } from "./navigationData";
import { useNavigationTreeStore } from "./navigationTreeStore";

export function NavigationTree() {
	const items = useNavigationTreeStore((s) => s.items);
	const groupIds = items[ROOT_ID]?.children ?? [];

	return (
		<div className="relative mt-4 flex flex-col gap-3">
			{groupIds.map((groupId) => {
				const groupData = items[groupId];
				if (!groupData) return null;

				const childIds = groupData.children ?? [];
				return (
					<SidebarGroup key={groupId} className="py-0">
						<NavigationSectionLabel data={groupData} />
						<SidebarGroupContent>
							<SidebarMenu className="gap-0.5">
								{childIds.map((childId) => (
									<NavigationTreeItem key={childId} id={childId} level={1} />
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				);
			})}
		</div>
	);
}
