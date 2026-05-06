import { SidebarMenuSub } from "ics-ui-kit/components/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "ics-ui-kit/components/collapsible";
import type { Item } from "./navigationData";
import type { ReactNode } from "react";
import { Icon } from "ics-ui-kit/components/icon";
import { ChevronRight } from "lucide-react";
import { cn } from "ics-ui-kit/lib/utils";
import { useNavigationTreeStore } from "./navigationTreeStore";
import { SideMenuItemContent } from "./SideMenuItemContent";

interface NavigationTreeItemProps {
	id: string;
	level: number;
}

export function NavigationTreeItem({ id, level }: NavigationTreeItemProps) {
	const data = useNavigationTreeStore((s) => s.items[id]);
	const open = useNavigationTreeStore((s) => s.expanded.has(id));
	const isSelected = useNavigationTreeStore((s) => s.selectedId === id);
	const toggleExpanded = useNavigationTreeStore((s) => s.toggleExpanded);
	const select = useNavigationTreeStore((s) => s.select);

	if (!data) return null;

	const childIds = data.children ?? [];
	const isFolder = childIds.length > 0;
	const isNested = level > 1;

	if (isFolder) {
		return (
			<NavigationTreeFolderRow
				id={id}
				data={data}
				isNested={isNested}
				open={open}
				onOpenChange={(next) => toggleExpanded(id, next)}
				isSelected={isSelected}
				onSelect={select}
			>
				{childIds.map((childId) => (
					<NavigationTreeItem key={childId} id={childId} level={level + 1} />
				))}
			</NavigationTreeFolderRow>
		);
	}

	return <SideMenuItemContent id={id} isNested={isNested} data={data} isSelected={isSelected} onSelect={select} />;
}

function NavigationTreeFolderRow({
	id,
	data,
	isNested,
	open,
	onOpenChange,
	isSelected,
	onSelect,
	children
}: {
	id: string;
	data: Item;
	isNested: boolean;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	isSelected: boolean;
	onSelect: (id: string) => void;
	children: ReactNode;
}) {
	return (
		<Collapsible open={open} onOpenChange={onOpenChange}>
			<SideMenuItemContent
				id={id}
				isNested={isNested}
				data={data}
				isSelected={isSelected}
				onSelect={onSelect}
				trigger={
					<CollapsibleTrigger asChild>
						<span className="group/actions flex size-4 items-center justify-center text-muted-foreground">
							<Icon
								icon={ChevronRight}
								className={cn(
									"shrink-0 stroke-[2.5] text-muted transition-transform group-hover/actions:text-primary-fg",
									open && "rotate-90"
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
