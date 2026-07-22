import { SidebarTrigger } from "ics-ui-kit/components/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "ics-ui-kit/components/tooltip";
import { cn } from "ics-ui-kit/lib/utils";
import { IconButton } from "ics-ui-kit/components/button";
import { Grip } from "lucide-react";
import { BreadcrumbListComponent } from "./BreadcrumbListComponent";
import { SIDEBAR_TRIGGER_ATTR } from "../../hooks/useSidebarFloating";

const sidebarTriggerFloatingProps = { [SIDEBAR_TRIGGER_ATTR]: true };

interface MainContentProps {
	isCollapsed: boolean;
}

export function MainContent({ isCollapsed }: MainContentProps) {
	return (
		<div className="relative flex h-full min-h-0 w-full flex-col bg-secondary-bg p-0 pl-[293px]">
			{isCollapsed && (
				<div
					className={cn(
						"absolute left-2.5 top-2.5 z-20",
						"pointer-events-auto flex h-auto w-auto flex-row gap-0.5 rounded-full border-0",
						"shadow-glass-sm bg-alpha-50 px-1.5 py-1"
					)}
				>
					<Tooltip>
						<TooltipTrigger asChild>
							<IconButton
								icon={Grip}
								size="sm"
								variant="ghost"
								className="shrink-0 rounded-full p-2 hover:!bg-secondary-border"
								iconClassName="size-4"
							/>
						</TooltipTrigger>
						<TooltipContent focus="high">Главная</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							<SidebarTrigger
								size="sm"
								iconClassName="size-4"
								className="shrink-0 rounded-full p-2 hover:!bg-secondary-border"
								{...sidebarTriggerFloatingProps}
							/>
						</TooltipTrigger>
						<TooltipContent focus="high">Показать боковую панель</TooltipContent>
					</Tooltip>
				</div>
			)}

			<div className="w-full py-2.5 pl-14 pr-4">
				<BreadcrumbListComponent />
			</div>
		</div>
	);
}
