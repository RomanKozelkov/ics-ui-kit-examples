import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "ics-ui-kit/components/collapsible";
import type { Item } from "./navigationData";
import type { ReactNode } from "react";
import { Icon } from "ics-ui-kit/components/icon";
import { ChevronRight } from "lucide-react";
import { cn } from "ics-ui-kit/lib/utils";
import { useNavigationTreeStore } from "./navigationTreeStore";
import { SideMenuItemContent } from "./SideMenuItemContent";
import { NavigationIndicator } from "./NavigationIndicator";
import { SidebarInsertionLine } from "../../shared/components/SidebarInsertionLine";
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
	const addItem = useNavigationTreeStore((s) => s.addItem);

	if (!data) return null;

	const childIds = data.children ?? [];
	const isFolder = childIds.length > 0;
	const indicator = data.indicator && <NavigationIndicator />;

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
			{isEditing && <NavigationInlineInput id={id} />}
			<SidebarInsertionLine onAdd={() => addItem(id)} />
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
	children: ReactNode;
}) {
	const addItem = useNavigationTreeStore((s) => s.addItem);

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
				<SidebarInsertionLine onAdd={() => addItem(id)} />
			</div>
			<CollapsibleContent>
				<div className="relative flex flex-col gap-0.5">{children}</div>
			</CollapsibleContent>
		</Collapsible>
	);
}
