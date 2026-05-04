import { SidebarTrigger, useSidebar } from "ics-ui-kit/components/sidebar";
import { cn } from "ics-ui-kit/lib/utils";
import { IconButton } from "ics-ui-kit/components/button";
import { Search } from "lucide-react";
import { Divider } from "ics-ui-kit/components/divider";
import { BreadcrumbListComponent } from "./BreadcrumbListComponent";
import { SIDEBAR_TRIGGER_ATTR } from "./useSidebarFloating";

const sidebarTriggerFloatingProps = { [SIDEBAR_TRIGGER_ATTR]: true };

export function MainContent() {
	const { state } = useSidebar();
	const isCollapsed = state === "collapsed";

	return (
		<div
			className={cn(
				"relative flex h-full min-h-0 w-full flex-col bg-primary-bg p-2",
				isCollapsed && "bg-secondary-bg p-0 pl-72"
			)}
		>
			{isCollapsed ? (
				<>
					<div
						className={cn(
							"absolute left-4 top-4 z-20",
							"pointer-events-auto flex flex-row gap-1 rounded-lg border-0.5 border-primary-border",
							"bg-sidebar-bg p-1 shadow-soft-base"
						)}
					>
						<IconButton
							icon={Search}
							size="xs"
							variant="ghost"
							className="shrink-0 p-1.5"
							iconClassName="size-4"
						/>
						<SidebarTrigger className="size-7 h-auto p-1.5" {...sidebarTriggerFloatingProps} />
					</div>

					<div className={cn("w-full rounded-t-xl bg-secondary-bg py-2.5 pl-14 pr-4")}>
						<BreadcrumbListComponent />
					</div>
				</>
			) : (
				<div className="w-full rounded-t-xl border border-secondary-border bg-secondary-bg py-2.5 pl-4 pr-2">
					<div className="flex items-center gap-2">
						<SidebarTrigger className="h-auto p-1.5" />
						<Divider orientation="vertical" className="h-4 shrink-0" />
						<BreadcrumbListComponent />
					</div>
				</div>
			)}
			<div
				className={cn(
					"h-full min-h-0 w-full border border-secondary-border bg-secondary-bg p-4",
					"border-t-0",
					isCollapsed && "border-0"
				)}
			/>
		</div>
	);
}
