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
import { useInsertionHover } from "../../hooks/useInsertionHover";
import { useShowsInsertionLine } from "../../hooks/useShowsInsertionLine";
import { SidebarMenuSub } from "ics-ui-kit/components/sidebar";
import { VerticalLineSegment } from "./sidebar-insertion-line/VerticalLineSegment";

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
	const handleParentHover = useInsertionHover(getParentId);
	const showsLine = useShowsInsertionLine(id);

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

	return (
		<div className="relative">
			{showsLine && <VerticalLineSegment />}
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
	const isHoveredParent = useNavigationTreeStore((s) => s.hoveredParentId === id);
	const { minDepth, maxDepth, getParentId } = useInsertionProps(id, level, open);
	const handleParentHover = useInsertionHover(getParentId);
	const showsLine = useShowsInsertionLine(id);
	const isNested = level > 1;

	return (
		<Collapsible open={open} onOpenChange={onOpenChange} className="relative flex flex-col gap-0.5">
			{showsLine && <VerticalLineSegment />}
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
				<div className="ml-6">
					<SidebarMenuSub className="ml-0 gap-0 border-none p-0 [&>*:not(:last-child)]:pb-0.5">
						{children}
					</SidebarMenuSub>
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
}
