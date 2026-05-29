import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "ics-ui-kit/components/collapsible";
import type { Item } from "../../data/navigationData";
import type { ReactNode } from "react";
import { Icon } from "ics-ui-kit/components/icon";
import { ChevronRight } from "lucide-react";
import { cn } from "ics-ui-kit/lib/utils";
import { SideMenuItemContent } from "./SideMenuItemContent";
import { NavigationIndicator } from "./NavigationIndicator";
import { SidebarInsertionLine } from "./sidebar-insertion-line/SidebarInsertionLine";
import { useNavigationTreeStore } from "../../store/navigationTreeStore";
import { useInsertionProps } from "../../hooks/useInsertionProps";
import { SidebarMenuSub } from "ics-ui-kit/components/sidebar";

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
	const items = useNavigationTreeStore((s) => s.items);
	const isNested = level > 1;

	const { minDepth, maxDepth, getParentId } = useInsertionProps(id, level, false);

	if (!data) return null;

	const childIds = data.children ?? [];
	const isFolder = childIds.length > 0;
	const indicator = data.indicator && <NavigationIndicator level={level} />;

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

	const setHoveredParentId = useNavigationTreeStore((s) => s.setHoveredParentId);
	const handleParentHover = (depth: number | null) => setHoveredParentId(depth !== null ? getParentId(depth) : null);

	return (
		<div className="relative">
			<SideMenuItemContent
				id={id}
				isNested={isNested}
				data={data}
				isSelected={isSelected}
				onSelect={select}
				indicator={indicator}
			/>
			<SidebarInsertionLine
				minDepth={minDepth}
				maxDepth={maxDepth}
				level={level}
				onAdd={(targetDepth) => {
					const parentId = getParentId(targetDepth);
					const parentName = parentId ? items[parentId]?.name : undefined;
					console.log(`Вставить в "${parentName}" после "${data.name}"`);
				}}
				onParentHover={handleParentHover}
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
	const items = useNavigationTreeStore((s) => s.items);
	const hoveredParentId = useNavigationTreeStore((s) => s.hoveredParentId);
	const setHoveredParentId = useNavigationTreeStore((s) => s.setHoveredParentId);
	const { minDepth, maxDepth, getParentId } = useInsertionProps(id, level, open);
	const isNested = level > 1;
	const isHoveredParent = hoveredParentId === id;
	const handleParentHover = (depth: number | null) => setHoveredParentId(depth !== null ? getParentId(depth) : null);

	return (
		<Collapsible open={open} onOpenChange={onOpenChange} className="flex flex-col gap-0.5">
			<div className="relative">
				<SideMenuItemContent
					id={id}
					isNested={isNested}
					data={data}
					isSelected={isSelected}
					onSelect={onSelect}
					isInsertionHovered={isHoveredParent}
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
					minDepth={minDepth}
					maxDepth={maxDepth}
					level={level}
					onAdd={(targetDepth) => {
						const parentId = getParentId(targetDepth);
						const parentName = parentId ? items[parentId]?.name : undefined;
						console.log(`Вставить в "${parentName}" после "${data.name}"`);
					}}
					onParentHover={handleParentHover}
				/>
			</div>
			<CollapsibleContent className="data-[state=open]:!overflow-visible">
				<div className="relative ml-6">
					<span
						className={cn(
							"pointer-events-none absolute left-0 top-0 w-px",
							"bottom-2",
							isHoveredParent ? "bg-primary-border" : "bg-transparent"
						)}
					/>
					<SidebarMenuSub className="ml-0 gap-0.5 border-none p-0">{children}</SidebarMenuSub>
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
}
