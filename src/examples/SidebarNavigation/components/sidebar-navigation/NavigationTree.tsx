import { SidebarGroup, SidebarGroupContent, SidebarMenu } from "ics-ui-kit/components/sidebar";
import { NavigationTreeItem } from "./NavigationTreeItem";
import { NavigationSectionLabel } from "./NavigationSectionLabel";
import { ROOT_ID } from "../../data/navigationData";
import { Layers, Layers2, Layers3 } from "lucide-react";
import { SidebarInsertionLine } from "./SidebarInsertionLine";
import { useNavigationTreeStore } from "../../store/navigationTreeStore";

const groupIcons = [Layers2, Layers3, Layers];

export function NavigationTree() {
	const items = useNavigationTreeStore((s) => s.items);
	const insertAfter = useNavigationTreeStore((s) => s.insertAfter);
	const groupIds = items[ROOT_ID]?.children ?? [];

	return (
		<div className="relative mt-4 flex flex-col gap-3">
			{groupIds.map((groupId, index) => {
				const groupData = items[groupId];
				if (!groupData) return null;

				const childIds = groupData.children ?? [];
				return (
					<SidebarGroup key={groupId} className="py-0 pr-4 group-data-[variant=floating]:pr-2.5">
						<div className="relative">
							<NavigationSectionLabel data={groupData} icon={groupIcons[index]} />
							<SidebarInsertionLine
								depth={1}
								minDepth={1}
								maxDepth={1}
								onAdd={() => insertAfter(groupId, 0, 1)}
							/>
						</div>
						<SidebarGroupContent>
							<SidebarMenu className="gap-0.5 pb-0.5">
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
