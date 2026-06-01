import { useNavigationTreeStore } from "../../store/navigationTreeStore";
import { NavigationIndicator } from "./NavigationIndicator";
import { SideMenuItemContent } from "./SideMenuItemContent";
import { SidebarInsertionLine } from "./sidebar-insertion-line/SidebarInsertionLine";
import { VerticalLineSegment } from "./sidebar-insertion-line/VerticalLineSegment";
import { DragInsertionLine } from "./sidebar-drag-drop/DragInsertionLine";
import { useInsertionProps } from "../../hooks/useInsertionProps";
import { useInsertionHover } from "../../hooks/useInsertionHover";
import { useInsertionAdd } from "../../hooks/useInsertionAdd";
import { useShowsInsertionLine } from "../../hooks/useShowsInsertionLine";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "ics-ui-kit/components/collapsible";
import { SidebarMenuSub } from "ics-ui-kit/components/sidebar";
import { Icon } from "ics-ui-kit/components/icon";
import { ChevronRight } from "lucide-react";
import { cn } from "ics-ui-kit/lib/utils";

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
	const isNested = level > 1;

	const isDragging = useNavigationTreeStore((s) => s.draggingId === id);
	const isInsertionTarget = useNavigationTreeStore((s) => s.hoveredParentId === id);
	const isDragTarget = useNavigationTreeStore(
		(s) => (s.dragTarget?.anchorId === id && s.dragTarget.mode === "into") || s.dragTarget?.parentId === id
	);
	const dropMode = useNavigationTreeStore((s) => s.dragTarget?.anchorId === id && s.dragTarget.mode);
	const isDropAfter = useNavigationTreeStore((s) => s.dragTarget?.anchorId === id && s.dragTarget.mode === "after");

	const isFolder = (data?.children?.length ?? 0) > 0;
	const { minDepth, maxDepth, getParentId } = useInsertionProps(id, level, isFolder ? open : false);
	const handleParentHover = useInsertionHover(getParentId);
	const handleAdd = useInsertionAdd(id, getParentId);
	const showsLine = useShowsInsertionLine(id);

	const { setNodeRef: setDroppableRef } = useDroppable({ id });
	const { attributes, listeners, setNodeRef: setDraggableRef } = useDraggable({ id });

	if (!data) return null;

	const childIds = data.children ?? [];
	const indicator = data.indicator && <NavigationIndicator level={level} />;
	const isHighlighted = isInsertionTarget || isDragTarget;

	if (isFolder) {
		const showsHeaderLine = dropMode === "after" || (dropMode === "into" && !open);
		const showsChildrenLine = dropMode === "into" && open;

		return (
			<Collapsible
				ref={setDroppableRef}
				open={open}
				onOpenChange={(next) => toggleExpanded(id, next)}
				className={cn("relative flex flex-col gap-0.5", isDragging && "opacity-50")}
			>
				{showsLine && <VerticalLineSegment />}
				<div className="relative">
					<SideMenuItemContent
						isNested={isNested}
						data={data}
						isSelected={isSelected}
						onSelect={() => select(id)}
						indicator={indicator}
						isHighlighted={isHighlighted}
						draggableRef={setDraggableRef}
						dragListeners={listeners}
						dragAttributes={attributes}
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
						onAdd={handleAdd}
						onParentHover={handleParentHover}
					/>
					{showsHeaderLine && <DragInsertionLine />}
				</div>
				<CollapsibleContent className="data-[state=open]:!overflow-visible">
					<div className="relative ml-6">
						<SidebarMenuSub className="ml-0 gap-0 border-none p-0 [&>*:not(:last-child)]:pb-0.5">
							{childIds.map((childId) => (
								<NavigationTreeItem key={childId} id={childId} level={level + 1} />
							))}
						</SidebarMenuSub>
						{showsChildrenLine && <DragInsertionLine />}
					</div>
				</CollapsibleContent>
			</Collapsible>
		);
	}

	return (
		<div ref={setDroppableRef} className="relative">
			{showsLine && <VerticalLineSegment />}
			<SideMenuItemContent
				isNested={isNested}
				data={data}
				isSelected={isSelected}
				onSelect={() => select(id)}
				indicator={indicator}
				isDragging={isDragging}
				isHighlighted={isHighlighted}
				draggableRef={setDraggableRef}
				dragListeners={listeners}
				dragAttributes={attributes}
			/>
			<SidebarInsertionLine
				minDepth={minDepth}
				maxDepth={maxDepth}
				level={level}
				onAdd={handleAdd}
				onParentHover={handleParentHover}
			/>
			{isDropAfter && <DragInsertionLine />}
		</div>
	);
}
