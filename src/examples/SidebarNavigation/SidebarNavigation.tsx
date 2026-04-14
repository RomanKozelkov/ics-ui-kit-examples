import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarInset,
	SidebarProvider,
	SidebarSeparator
} from "ics-ui-kit/components/sidebar";
import React from "react";
import { MainContent } from "./MainContent";
import { NavigationTree } from "./NavigationTree";
import { SidebarFooter as SidebarFooterContent } from "./SidebarFooter";
import { SidebarHeader } from "./SidebarHeader";

export function SidebarNavigation() {
	return (
		<div className="h-full w-full">
			<SidebarProvider
				className="h-full w-full"
				style={{ "--sidebar-width": "272px" } as React.CSSProperties}
			>
				<Sidebar
					side="left"
					variant="sidebar"
					collapsible="offcanvas"
					className="pt-2 pl-2 group-data-[side=left]:border-none"
				>
					<SidebarHeader />
					<SidebarContent className="mt-4">
						<NavigationTree />
					</SidebarContent>
					<SidebarSeparator />
					<SidebarFooter>
						<SidebarFooterContent />
					</SidebarFooter>
				</Sidebar>
				<SidebarInset>
					<MainContent />
				</SidebarInset>
			</SidebarProvider>
		</div>
	);
}
