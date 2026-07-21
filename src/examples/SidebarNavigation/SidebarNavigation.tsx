import {
	Sidebar,
	SidebarContent,
	SidebarInset,
	SidebarProvider,
	SidebarRail
} from "ics-ui-kit/components/sidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "ics-ui-kit/components/tooltip";
import { cn } from "ics-ui-kit/lib/utils";
import React from "react";
import { MainContent } from "./components/main-content/MainContent";
import { NavigationTree } from "./components/sidebar-navigation/NavigationTree";
import { useSidebarFloating, SIDEBAR_TRIGGER_ATTR } from "./hooks/useSidebarFloating";
import "./styles/theme.css";
import { SidebarHeader } from "./components/sidebar-header/SidebarHeader";

type SidebarMode = "floating" | "collapsed";

export function SidebarNavigation() {
	const [mode, setMode] = React.useState<SidebarMode>("floating");
	const sidebarRef = React.useRef<HTMLDivElement>(null);

	const isCollapsed = mode === "collapsed";
	const { isSidebarFloating } = useSidebarFloating(sidebarRef as React.RefObject<HTMLDivElement>, isCollapsed);

	const isSidebarVisible = !isCollapsed || isSidebarFloating;

	return (
		<div className="gramax h-full w-full bg-primary-bg">
			{isCollapsed && (
				<div
					{...{ [SIDEBAR_TRIGGER_ATTR]: true }}
					className="fixed inset-y-0 left-0 z-30 w-[5px] cursor-ew-resize"
				/>
			)}
			<SidebarProvider
				className="h-full w-full"
				style={{ "--sidebar-width": "293px" } as React.CSSProperties}
				open={false}
				onOpenChange={(open) => { if (open) setMode("floating"); }}
			>
				<Sidebar
					ref={sidebarRef}
					side="left"
					variant="floating"
					collapsible="offcanvas"
					className={cn(
						"pl-2 pt-2 group-data-[side=left]:border-none",
						"sidebar-nav-floating",
						!isCollapsed && "sidebar-nav-mode-floating",
						isSidebarVisible && "sidebar-nav-floating-open"
					)}
				>
					{!isCollapsed && <SidebarHeader onCollapse={() => setMode("collapsed")} />}
					<SidebarContent>
						<NavigationTree />
					</SidebarContent>
					{isCollapsed && (
						<TooltipProvider delayDuration={700}>
							<Tooltip>
								<TooltipTrigger asChild>
									<SidebarRail />
								</TooltipTrigger>
								<TooltipContent side="right" focus="high">
									Раскрыть боковую панель
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					)}
				</Sidebar>
				<SidebarInset>
					<MainContent isCollapsed={isCollapsed} />
				</SidebarInset>
			</SidebarProvider>
		</div>
	);
}
