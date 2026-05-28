import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "ics-ui-kit/components/collapsible";
import type { Item } from "./navigationData";
import type { ReactNode } from "react";
import { Icon } from "ics-ui-kit/components/icon";
import { ChevronRight } from "lucide-react";
import { cn } from "ics-ui-kit/lib/utils";
import { useNavigationTreeStore } from "./navigationTreeStore";
import { SideMenuItemContent } from "./SideMenuItemContent";
import { NavigationIndicator } from "./NavigationIndicator";
import { SidebarInsertionLine } from "./SidebarInsertionLine";
import { NavigationInlineInput } from "./NavigationInlineInput";

interface NavigationTreeItemProps {
	id: string;
	level: number;
}

export function NavigationTreeItem({ id, level }: NavigationTreeItemProps) {
	const data = useNavigationTreeStore((s) => s.items[id]);
	const open = useNavigationTreeStore((s) => s.expanded.has(id));
	const isSelected = useNavigationTreeStore((s) => s.selectedId === id);
	const isEditing = useNavigationTreeStore((s) => s.editingId === id);
	const toggleExpanded = useNavigationTreeStore((s) => s.toggleExpanded);
	const select = useNavigationTreeStore((s) => s.select);
	const insertAfter = useNavigationTreeStore((s) => s.insertAfter);

	if (!data) return null;

	const childIds = data.children ?? [];
	const isFolder = childIds.length > 0;
	const indicator = data.indicator && <NavigationIndicator />;

	const minDepth = 1;
	const maxDepth = level + 1;

	if (isFolder) {
		return (
			<NavigationTreeFolderRow
				id={id}
				level={level}
				data={data}
				open={open}
				onOpenChange={(next) => toggleExpanded(id, next)}
				isSelected={isSelected}
				onSelect={select}
				indicator={indicator}
				minDepth={minDepth}
				maxDepth={maxDepth}
			>
				{childIds.map((childId) => (
					<NavigationTreeItem key={childId} id={childId} level={level + 1} />
				))}
			</NavigationTreeFolderRow>
		);
	}

	return (
		<div className="relative">
			<SideMenuItemContent
				id={id}
				level={level}
				data={data}
				isSelected={isSelected}
				onSelect={select}
				indicator={indicator}
			/>
			{isEditing && <NavigationInlineInput id={id} level={level} />}
			<SidebarInsertionLine
				depth={level}
				minDepth={minDepth}
				maxDepth={maxDepth}
				onAdd={(targetDepth) => insertAfter(id, level, targetDepth)}
			/>
		</div>
	);
}

function NavigationTreeFolderRow({
	id,
	level,
	data,
	open,
	onOpenChange,
	isSelected,
	onSelect,
	indicator,
	minDepth,
	maxDepth,
	children
}: {
	id: string;
	level: number;
	data: Item;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	isSelected: boolean;
	onSelect: (id: string) => void;
	indicator?: ReactNode;
	minDepth: number;
	maxDepth: number;
	children: ReactNode;
}) {
	const insertAfter = useNavigationTreeStore((s) => s.insertAfter);

	return (
		<Collapsible open={open} onOpenChange={onOpenChange} className="flex flex-col gap-0.5">
			<div className="relative">
				<SideMenuItemContent
					id={id}
					level={level}
					data={data}
					isSelected={isSelected}
					onSelect={onSelect}
					indicator={indicator}
					trigger={
						<CollapsibleTrigger asChild>
							<span
								className="group/actions flex size-4 items-center justify-center text-muted-foreground"
								onClick={(e) => e.stopPropagation()}
							>
								<Icon
									icon={ChevronRight}
									size="sm"
									className={cn(
										"shrink-0 stroke-[2.5] text-muted transition-transform group-hover/actions:text-primary-fg",
										open && "rotate-90"
									)}
								/>
							</span>
						</CollapsibleTrigger>
					}
				/>
				<SidebarInsertionLine
					depth={level}
					minDepth={minDepth}
					maxDepth={maxDepth}
					onAdd={(targetDepth) => insertAfter(id, level, targetDepth)}
				/>
			</div>
			<CollapsibleContent>
				<div className="relative flex flex-col gap-0.5">{children}</div>
			</CollapsibleContent>
		</Collapsible>
	);
}
