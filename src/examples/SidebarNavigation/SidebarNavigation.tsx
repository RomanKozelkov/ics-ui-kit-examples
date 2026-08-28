import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarInset,
	SidebarProvider,
	SidebarRail,
	SidebarSeparator
} from "ics-ui-kit/components/sidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "ics-ui-kit/components/tooltip";
import { cn } from "ics-ui-kit/lib/utils";
import React from "react";
import { MainContent } from "./components/main-content/MainContent";
import { NavigationTree } from "./components/sidebar-navigation/NavigationTree";
import { SidebarFooter as SidebarFooterContent } from "./components/sidebar-footer/SidebarFooter";
import { useSidebarFloating } from "./hooks/useSidebarFloating";
import "./styles/theme.css";
import { SidebarHeader } from "./components/sidebar-header/SidebarHeader";

export function SidebarNavigation() {
	const [open, setOpen] = React.useState(true);
	const sidebarRef = React.useRef<HTMLDivElement>(null);
	const prevOpenRef = React.useRef(open);

	const [visualVariant, setVisualVariant] = React.useState<"sidebar" | "floating">(() =>
		open ? "sidebar" : "floating"
	);

	const isFloatingMode = visualVariant === "floating";
	const sidebarWidth = isFloatingMode ? "284px" : "300px";
	const { isSidebarFloating } = useSidebarFloating(sidebarRef as React.RefObject<HTMLDivElement>, isFloatingMode);

	React.useEffect(() => {
		if (prevOpenRef.current === open) return;
		setVisualVariant("sidebar");
		prevOpenRef.current = open;
	}, [open]);

	const onSidebarTransitionEnd = React.useCallback(
		(event: React.TransitionEvent<HTMLDivElement>) => {
			if (event.target !== event.currentTarget) return;
			if (!["left", "right", "width"].includes(event.propertyName)) return;
			if (!open) {
				setVisualVariant("floating");
			}
		},
		[open]
	);

	return (
		<div className="gramax h-full w-full bg-primary-bg">
			<SidebarProvider
				className="h-full w-full"
				style={{ "--sidebar-width": sidebarWidth } as React.CSSProperties}
				open={open}
				onOpenChange={setOpen}
			>
				<Sidebar
					ref={sidebarRef}
					side="left"
					variant={visualVariant}
					collapsible="offcanvas"
					onTransitionEnd={onSidebarTransitionEnd}
					className={cn(
						"pl-2 pt-2 group-data-[side=left]:border-none",
						visualVariant === "floating" && "sidebar-nav-floating",
						isSidebarFloating && "sidebar-nav-floating-open"
					)}
				>
					{!isSidebarFloating && <SidebarHeader />}
					<SidebarContent>
						<NavigationTree />
					</SidebarContent>
					<SidebarSeparator />
					<SidebarFooter>
						<SidebarFooterContent />
					</SidebarFooter>
					<TooltipProvider delayDuration={700}>
						<Tooltip>
							<TooltipTrigger asChild>
								<SidebarRail className="[[data-state=expanded]_&]:hidden" />
							</TooltipTrigger>
							<TooltipContent side="right" focus="high">
								Раскрыть боковую панель
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</Sidebar>
				<SidebarInset>
					<MainContent />
				</SidebarInset>
			</SidebarProvider>
		</div>
	);
}
