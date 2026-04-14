import { Divider } from "ics-ui-kit/components/divider";
import { SidebarTrigger } from "ics-ui-kit/components/sidebar";
import {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbSeparator,
	BreadcrumbPage
} from "ics-ui-kit/components/breadcrumb";

export function MainContent() {
	return (
		<div className="h-full w-full flex flex-col bg-primary-bg p-2">
			<div className="w-full py-2.5 pl-4 pr-0 border border-secondary-border rounded-t-xl bg-secondary-bg">
				<div className="flex items-center gap-2">
					<SidebarTrigger className="p-1.5 h-auto" />
					<Divider orientation="vertical" className="shrink-0 h-4" />
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink href="#">
									Great design is invisible
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage>
									What "Invisible" Means
								</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</div>
			</div>
			<div className="bg-secondary-bg h-full w-full p-4 border border-secondary-border border-t-0"></div>
		</div>
	);
}
