import { useItemState } from "../../hooks/useItemState";
import { useItemDndState } from "../../hooks/useItemDndState";
import { useInsertionLine } from "../../hooks/useInsertionLine";
import { NavigationIndicator } from "./NavigationIndicator";
import { SideMenuItemContent } from "./SideMenuItemContent";
import { SidebarInsertionLine } from "./sidebar-insertion-line/SidebarInsertionLine";
import { VerticalLineSegment } from "./sidebar-insertion-line/VerticalLineSegment";
import { DragInsertionLine } from "./sidebar-drag-drop/DragInsertionLine";
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
	const { data, open, isSelected, toggleExpanded, select } = useItemState(id);
	const {
		isDragging,
		isInsertionTarget,
		isDragTarget,
		dropMode,
		isDropAfter,
		setDroppableRef,
		setDraggableRef,
		dragListeners,
		dragAttributes
	} = useItemDndState(id);

	const isFolder = (data?.children?.length ?? 0) > 0;
	const { minDepth, maxDepth, handleAdd, handleParentHover, showsLine } = useInsertionLine(
		id,
		level,
		isFolder,
		open
	);

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
				dragListeners={dragListeners}
				dragAttributes={dragAttributes}
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
