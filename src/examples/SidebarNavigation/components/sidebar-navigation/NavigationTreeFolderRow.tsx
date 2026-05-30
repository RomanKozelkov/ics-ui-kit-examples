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
	children
}: NavigationTreeFolderRowProps) {
	const { minDepth, maxDepth, getParentId } = useInsertionProps(id, level, open);
	const handleParentHover = useInsertionHover(getParentId);
	const handleAdd = useInsertionAdd(id, getParentId);
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
