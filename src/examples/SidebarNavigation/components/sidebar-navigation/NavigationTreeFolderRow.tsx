import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "ics-ui-kit/components/collapsible";
import type { Item } from "../../data/navigationData";
import type { ReactNode } from "react";
import { Icon } from "ics-ui-kit/components/icon";
import { ChevronRight } from "lucide-react";
import { cn } from "ics-ui-kit/lib/utils";
import { SidebarMenuSub } from "ics-ui-kit/components/sidebar";
import { SideMenuItemContent } from "./SideMenuItemContent";
import { SidebarInsertionLine } from "./sidebar-insertion-line/SidebarInsertionLine";
import { VerticalLineSegment } from "./sidebar-insertion-line/VerticalLineSegment";
import { useInsertionProps } from "../../hooks/useInsertionProps";
import { useInsertionHover } from "../../hooks/useInsertionHover";
import { useInsertionAdd } from "../../hooks/useInsertionAdd";
import { useShowsInsertionLine } from "../../hooks/useShowsInsertionLine";
import { useNavigationTreeStore } from "../../store/navigationTreeStore";
import { DragInsertionLine } from "./sidebar-drag-drop/DragInsertionLine";
interface NavigationTreeFolderRowProps {
	id: string;
	level: number;
	data: Item;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	isSelected: boolean;
	onSelect: (id: string) => void;
	indicator?: ReactNode;
	children: ReactNode;
	droppableRef: (el: HTMLElement | null) => void;
}

export function NavigationTreeFolderRow({
	id,
	level,
	data,
	open,
	onOpenChange,
	isSelected,
	onSelect,
	indicator,
	children,
	droppableRef
}: NavigationTreeFolderRowProps) {
	const { minDepth, maxDepth, getParentId } = useInsertionProps(id, level, open);
	const handleParentHover = useInsertionHover(getParentId);
	const handleAdd = useInsertionAdd(id, getParentId);
	const showsLine = useShowsInsertionLine(id);
	const isNested = level > 1;

	const isDragging = useNavigationTreeStore((s) => s.draggingId === id);
	const dropMode = useNavigationTreeStore((s) => s.dragTarget?.anchorId === id && s.dragTarget.mode);
	const showsHeaderLine = dropMode === "after" || (dropMode === "into" && !open);
	const showsChildrenLine = dropMode === "into" && open;

	return (
		<Collapsible
			ref={droppableRef}
			open={open}
			onOpenChange={onOpenChange}
			className={cn("relative flex flex-col gap-0.5", isDragging && "opacity-50")}
		>
			{showsLine && <VerticalLineSegment />}
			<div className="relative">
				<SideMenuItemContent
					id={id}
					isNested={isNested}
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
						{children}
					</SidebarMenuSub>
					{showsChildrenLine && <DragInsertionLine />}
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
}
