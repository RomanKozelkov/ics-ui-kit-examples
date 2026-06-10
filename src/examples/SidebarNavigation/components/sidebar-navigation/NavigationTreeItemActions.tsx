import { Icon } from "ics-ui-kit/components/icon";
import { Tooltip, TooltipContent, TooltipTrigger } from "ics-ui-kit/components/tooltip";
import { MoreHorizontal, Plus } from "lucide-react";

export function NavigationTreeItemActions() {
	return (
		<span className="ml-auto flex shrink-0 items-center gap-1.5">
			<span className="flex shrink-0 items-center gap-1.5">
				<Tooltip>
					<TooltipTrigger asChild>
						<span
							className="hover:bg-sidebar-accent group/actions pointer-events-none flex size-5 items-center justify-center rounded text-muted-foreground opacity-0 group-hover/nav:pointer-events-auto group-hover/nav:opacity-100 group-data-[active=true]/nav:pointer-events-auto group-data-[active=true]/nav:opacity-100"
							onClick={(e) => e.stopPropagation()}
						>
							<Icon icon={MoreHorizontal} className="group-hover/actions:text-primary-fg" />
						</span>
					</TooltipTrigger>
					<TooltipContent focus="high">Действия со статьей</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						<span
							className="hover:bg-sidebar-accent group/add pointer-events-none flex size-5 items-center justify-center rounded text-muted-foreground opacity-0 group-hover/nav:pointer-events-auto group-hover/nav:opacity-100 group-data-[active=true]/nav:pointer-events-auto group-data-[active=true]/nav:opacity-100"
							onClick={(e) => e.stopPropagation()}
						>
							<Icon icon={Plus} className="group-hover/add:text-primary-fg" />
						</span>
					</TooltipTrigger>
					<TooltipContent focus="high">Добавить дочернюю статью</TooltipContent>
				</Tooltip>
			</span>
		</span>
	);
}
