import { useNavigationItem } from "../../hooks/useNavigationItem";
import { useItemDndState } from "../../hooks/useItemDndState";
import { useInsertionLineState } from "../../hooks/useInsertionLineState";
import { useDragLineState } from "../../hooks/useDragLineState";
import { NavigationIndicator } from "./NavigationIndicator";
import { SideMenuItemContent } from "./SideMenuItemContent";
import { SidebarInsertionLine } from "./sidebar-insertion-line/SidebarInsertionLine";
import { VerticalLineSegment } from "./VerticalLineSegment";
import { DragInsertionLine } from "./sidebar-drag-drop/DragInsertionLine";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "ics-ui-kit/components/collapsible";
import { SidebarMenuSub } from "ics-ui-kit/components/sidebar";
import { Icon } from "ics-ui-kit/components/icon";
import { ChevronRight } from "lucide-react";
import { cn } from "ics-ui-kit/lib/utils";
import { useState } from "react";

interface NavigationTreeItemProps {
	id: string;
	level: number;
}

export function NavigationTreeItem({ id, level }: NavigationTreeItemProps) {
	const [animating, setAnimating] = useState(false);
	const { data, open, isSelected, toggleExpanded, select } = useNavigationItem(id);
	const {
		isDragging,
		isInsertionTarget,
		isDragTarget,
		dropMode,
		setDroppableRef,
		setDraggableRef,
		dragListeners,
		dragAttributes
	} = useItemDndState(id);

	const isFolder = (data?.children?.length ?? 0) > 0;
	const { minDepth, maxDepth, handleAdd, handleParentHover, showsLine, isAnchor } = useInsertionLineState(
		id,
		level,
		isFolder,
		open
	);
	const { showsDragLine, isDragAnchor } = useDragLineState(id);

	if (!data) return null;

	const isNested = level > 1;
	const childIds = data.children ?? [];
	const indicator = data.indicator && <NavigationIndicator level={level} />;
	const isHighlighted = isInsertionTarget || isDragTarget;

	if (isFolder) {
		const showsHeaderLine = dropMode === "after" || (dropMode === "into" && !open);
		const showsChildrenLine = dropMode === "into" && open;

		return (
			<Collapsible
				open={open}
				onOpenChange={(next) => toggleExpanded(id, next)}
				className={cn("relative flex flex-col", isDragging && "opacity-50")}
			>
				{(showsLine || (showsDragLine && !isDragAnchor && level > 1)) && (
					<VerticalLineSegment className={isAnchor ? "bottom-[0.3125rem]" : undefined} />
				)}
				<div ref={setDroppableRef} className="relative">
					{showsDragLine && isDragAnchor && level > 1 && (
						<VerticalLineSegment className="bottom-[0.3125rem]" />
					)}
					<SideMenuItemContent
						isNested={isNested}
						data={data}
						isSelected={isSelected}
						onSelect={() => select(id)}
						indicator={indicator}
						isHighlighted={isHighlighted}
						draggableRef={setDraggableRef}
						dragListeners={dragListeners}
						dragAttributes={dragAttributes}
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
						className="-bottom-[0.3125rem]"
					/>
					{showsHeaderLine && <DragInsertionLine />}
				</div>
				<CollapsibleContent
					className={cn(!animating && "data-[state=open]:!overflow-visible")}
					onAnimationStart={() => setAnimating(true)}
					onAnimationEnd={() => setAnimating(false)}
				>
					<div className="relative ml-6 pt-0.5">
						<SidebarMenuSub className="ml-0 gap-0 border-none p-0 [&>*:not(:first-child)]:pt-0.5">
							{childIds.map((childId) => (
								<NavigationTreeItem key={childId} id={childId} level={level + 1} />
							))}
						</SidebarMenuSub>
						{showsChildrenLine && <DragInsertionLine className="top-0 -translate-y-1/2" />}
					</div>
				</CollapsibleContent>
			</Collapsible>
		);
	}

	return (
		<div ref={setDroppableRef} className="relative">
			{(showsLine || (showsDragLine && level > 1)) && (
				<VerticalLineSegment className={isAnchor || isDragAnchor ? "bottom-[0.3125rem]" : undefined} />
			)}
			<SideMenuItemContent
				isNested={isNested}
				data={data}
				isSelected={isSelected}
				onSelect={() => select(id)}
				indicator={indicator}
				isDragging={isDragging}
				isHighlighted={isHighlighted}
				draggableRef={setDraggableRef}
				dragListeners={dragListeners}
				dragAttributes={dragAttributes}
			/>
			<SidebarInsertionLine
				minDepth={minDepth}
				maxDepth={maxDepth}
				level={level}
				onAdd={handleAdd}
				onParentHover={handleParentHover}
				className="-bottom-[0.3125rem]"
			/>
			{dropMode && <DragInsertionLine className={dropMode === "into" ? "left-6" : undefined} />}
		</div>
	);
}
