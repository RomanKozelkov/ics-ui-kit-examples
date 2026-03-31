import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger
} from "ics-ui-kit/components/collapsible";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarRail,
	SidebarSeparator
} from "ics-ui-kit/components/sidebar";
import {
	ChevronRight,
	Home,
	LayoutDashboard,
	LogIn,
	Table,
	UserPlus
} from "lucide-react";
import { NavLink } from "react-router";

const examplePages = [
	{
		title: "Dashboard",
		path: "/examples/dashboard",
		icon: LayoutDashboard
	},
	{
		title: "Login Form",
		path: "/examples/login-form",
		icon: LogIn
	},
	{
		title: "Registration Form",
		path: "/examples/registration-form",
		icon: UserPlus
	},
	{
		title: "Data Grid",
		path: "/examples/data-grid",
		icon: Table
	}
];

export default function AppSidebar() {
	return (
		<Sidebar collapsible="offcanvas" side="left" variant="sidebar">
			<SidebarHeader>UI Kit Examples</SidebarHeader>
			<SidebarSeparator />
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton asChild tooltip="Home">
									<NavLink to="/">
										<Home />
										<span>Home</span>
									</NavLink>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarGroup>
					<SidebarGroupLabel>Examples</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<Collapsible
								className="group/sidebar-menu"
								defaultOpen
							>
								<SidebarMenuItem>
									<CollapsibleTrigger asChild>
										<SidebarMenuButton tooltip="Examples">
											<LayoutDashboard />
											<span>Pages</span>
											<ChevronRight className="ml-auto text-muted transition-transform group-data-[state=open]/sidebar-menu:rotate-90" />
										</SidebarMenuButton>
									</CollapsibleTrigger>
									<CollapsibleContent>
										<SidebarMenuSub>
											{examplePages.map((page) => (
												<SidebarMenuSubItem
													key={page.path}
												>
													<SidebarMenuSubButton
														asChild
													>
														<NavLink to={page.path}>
															<page.icon />
															<span>
																{page.title}
															</span>
														</NavLink>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											))}
										</SidebarMenuSub>
									</CollapsibleContent>
								</SidebarMenuItem>
							</Collapsible>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
}
