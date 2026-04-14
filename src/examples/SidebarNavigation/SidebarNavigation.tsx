import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarInset,
	SidebarProvider,
	SidebarRail,
	SidebarSeparator,
	SidebarTrigger
} from "ics-ui-kit/components/sidebar";
import {
	GitBranch,
	History,
	LayoutGrid,
	Palette,
	RefreshCw,
	Search
} from "lucide-react";
import { NavigationTree } from "./NavigationTree";

export function SidebarNavigation() {
	return (
		<div className="h-full w-full">
			<SidebarProvider className="h-full w-full">
				<Sidebar side="left" variant="sidebar" collapsible="offcanvas">
					<SidebarHeader>
						<div className="flex items-center gap-2 px-2 py-1">
							<LayoutGrid className="size-5 text-muted-foreground" />
							<div className="border border-secondary-border bg-red-300 mx-2">
								g]
							</div>
							<span className="flex-1 truncate font-medium text-sm">
								Gramax Team
							</span>
							<button
								type="button"
								className="text-muted-foreground hover:text-foreground"
							>
								<Search className="size-4" />
							</button>
						</div>
						<div className="flex items-center gap-2 px-2 py-1.5 text-muted-foreground text-sm">
							<Palette className="size-4" />
							<span>Command Palette</span>
						</div>
					</SidebarHeader>
					<SidebarSeparator />
					<SidebarContent>
						<NavigationTree />
					</SidebarContent>
					<SidebarSeparator />
					<SidebarFooter>
						<div className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-white text-xs">
							<GitBranch className="size-3.5" />
							<span className="flex-1 font-medium">master</span>
							<History className="size-3.5 opacity-80" />
							<RefreshCw className="size-3.5 opacity-80" />
							<span className="opacity-80">1↑</span>
						</div>
					</SidebarFooter>
					<SidebarRail />
				</Sidebar>
				<SidebarInset>
					<header className="flex items-center gap-3 border-b p-3">
						<SidebarTrigger />
						<span className="text-muted-foreground text-sm">
							Drag items inside the sidebar to reorder or move
							them between groups
						</span>
					</header>
					<main className="flex-1 p-6" />
				</SidebarInset>
			</SidebarProvider>
		</div>
	);
}
