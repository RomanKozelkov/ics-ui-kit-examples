import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from "ics-ui-kit/components/breadcrumb";
import { Divider } from "ics-ui-kit/components/divider";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger
} from "ics-ui-kit/components/sidebar";
import { Fragment } from "react";
import { Link, Outlet, useLocation } from "react-router";
import AppSidebar from "./AppSidebar";

const segmentTitles: Record<string, string> = {
	examples: "Examples",
	"login-form": "Login Form",
	"registration-form": "Registration Form",
	dashboard: "Dashboard",
	"data-grid": "Data Grid",
	category: "Category",
	component: "Component"
};

function slugToTitle(slug: string): string {
	return (
		segmentTitles[slug] ??
		slug
			.split("-")
			.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
			.join(" ")
	);
}

export default function Layout() {
	const { pathname } = useLocation();
	const segments = pathname.split("/").filter(Boolean);

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Divider
							orientation="vertical"
							className="mr-2 data-[orientation=vertical]:h-4"
						/>
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem className="hidden md:block">
									<BreadcrumbLink asChild>
										<Link to="/">UI Kit Examples</Link>
									</BreadcrumbLink>
								</BreadcrumbItem>
								{segments.map((segment, i) => {
									const path =
										"/" +
										segments.slice(0, i + 1).join("/");
									const isLast = i === segments.length - 1;
									return (
										<Fragment key={path}>
											<BreadcrumbSeparator className="hidden md:block" />
											<BreadcrumbItem className="hidden md:block">
												{isLast ? (
													<BreadcrumbPage>
														{slugToTitle(segment)}
													</BreadcrumbPage>
												) : (
													<BreadcrumbLink asChild>
														<Link to={path}>
															{slugToTitle(
																segment
															)}
														</Link>
													</BreadcrumbLink>
												)}
											</BreadcrumbItem>
										</Fragment>
									);
								})}
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				</header>
				<div className="p-4 pt-0">
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
