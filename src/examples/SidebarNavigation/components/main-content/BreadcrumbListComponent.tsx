import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from "ics-ui-kit/components/breadcrumb";

export function BreadcrumbListComponent() {
	return (
		<Breadcrumb className="min-w-0 pl-2">
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Great design is invisible</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator>
					<span className="text-base text-muted">/</span>
				</BreadcrumbSeparator>
				<BreadcrumbItem>
					<BreadcrumbPage>What "Invisible" Means</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	);
}
