import { Icon } from "ics-ui-kit/components/icon";
import { Tooltip, TooltipContent, TooltipTrigger } from "ics-ui-kit/components/tooltip";
import { MoreHorizontal, Plus } from "lucide-react";

export function NavigationTreeItemActions() {
	return (
		<span className="absolute right-1.5 top-1/2 -translate-y-1/2 invisible flex shrink-0 items-center gap-1 group-hover/nav:visible">
			<Tooltip>
				<TooltipTrigger asChild>
					<span
						className="hover:bg-sidebar-accent group/actions flex size-5 items-center justify-center rounded-lg text-muted-foreground"
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
						className="hover:bg-sidebar-accent group/add flex size-5 items-center justify-center rounded-lg text-muted-foreground"
						onClick={(e) => e.stopPropagation()}
					>
						<Icon icon={Plus} className="group-hover/add:text-primary-fg" />
					</span>
				</TooltipTrigger>
				<TooltipContent focus="high">Добавить дочернюю статью</TooltipContent>
			</Tooltip>
		</span>
	);
}
