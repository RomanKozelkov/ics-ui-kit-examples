import { Icon } from "ics-ui-kit/components/icon";
import { Tooltip, TooltipContent, TooltipTrigger } from "ics-ui-kit/components/tooltip";
import { cn } from "ics-ui-kit/lib/utils";
import { MoreHorizontal } from "lucide-react";
import { ReactNode } from "react";

export function NavigationTreeItemActions({ trigger }: { trigger?: ReactNode }) {
	return (
		<span className={cn("flex flex-1 items-center", trigger ? "min-w-10" : "min-w-5")}>
			{trigger}
			<Tooltip>
				<TooltipTrigger asChild>
					<span
						className="hover:bg-sidebar-accent group/actions pointer-events-none ml-auto flex size-5 items-center justify-center rounded text-muted-foreground opacity-0 group-hover/nav:pointer-events-auto group-hover/nav:opacity-100 group-data-[active=true]/nav:pointer-events-auto group-data-[active=true]/nav:opacity-100"
						onClick={(e) => e.stopPropagation()}
					>
						<Icon icon={MoreHorizontal} className="group-hover/actions:text-primary-fg" />
					</span>
				</TooltipTrigger>
				<TooltipContent focus="high">Действия со статьей</TooltipContent>
			</Tooltip>
		</span>
	);
}
