import { SidebarTrigger } from "ics-ui-kit/components/sidebar";
import {
	Tooltip,
	TooltipContent,
	TooltipShortcut,
	TooltipText,
	TooltipTrigger
} from "ics-ui-kit/components/tooltip";
import { cn } from "ics-ui-kit/lib/utils";
import { IconButton } from "ics-ui-kit/components/button";
import { Search } from "lucide-react";
import { BreadcrumbListComponent } from "./BreadcrumbListComponent";
import { SIDEBAR_TRIGGER_ATTR } from "../../hooks/useSidebarFloating";

const sidebarTriggerFloatingProps = { [SIDEBAR_TRIGGER_ATTR]: true };

interface MainContentProps {
	isCollapsed: boolean;
}

export function MainContent({ isCollapsed }: MainContentProps) {
	return (
		<div className="relative flex h-full min-h-0 w-full flex-col bg-secondary-bg p-0 pl-[293px]">
			{isCollapsed ? (
				<>
					<div
						className={cn(
							"absolute left-4 top-4 z-20",
							"pointer-events-auto flex h-9 w-[4.25rem] flex-row gap-1 rounded-lg border-0.5 border-primary-border",
							"bg-sidebar-bg p-1 shadow-soft-base"
						)}
					>
						<Tooltip>
							<TooltipTrigger asChild>
								<SidebarTrigger
									className="size-7 h-auto rounded-md p-1.5"
									{...sidebarTriggerFloatingProps}
								/>
							</TooltipTrigger>
							<TooltipContent focus="high">Показать боковую панель</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger asChild>
								<IconButton
									icon={Search}
									size="xs"
									variant="ghost"
									className="shrink-0 rounded-md p-1.5"
									iconClassName="size-4"
								/>
							</TooltipTrigger>
							<TooltipContent focus="high" className="flex flex-row gap-2">
								<TooltipText>Поиск</TooltipText>
								<TooltipShortcut>⌘/</TooltipShortcut>
							</TooltipContent>
						</Tooltip>
					</div>

					<div className="w-full py-2.5 pl-14 pr-4">
						<BreadcrumbListComponent />
					</div>
				</>
			) : (
				<div className="w-full py-2.5 pl-14 pr-4">
					<BreadcrumbListComponent />
				</div>
			)}
			<div
				className={cn(
					"relative h-full min-h-0 w-full bg-secondary-bg p-4",
					isCollapsed && "border-0"
				)}
			/>
		</div>
	);
}
