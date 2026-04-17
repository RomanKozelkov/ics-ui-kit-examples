import { useEffect, useState } from "react";
import { api } from "./Api";
import { Button, IconButton } from "ics-ui-kit/components/button";
import { Filter, Settings } from "lucide-react";
import { Toggle } from "ics-ui-kit/components/toggle";
import { Icon } from "ics-ui-kit/components/icon";
import { Collapsible, CollapsibleContent } from "ics-ui-kit/components/collapsible";
import { Filters } from "./Filters";

export function PrimarySalesDashboard() {
	const [filtersCollapsed, setFiltersCollapsed] = useState(false);

	return (
		<div className="h-full w-full bg-primary-bg">
			<div className="container mx-auto py-4">
				<div className="flex flex-col rounded-xl border border-secondary-border bg-secondary-bg p-4">
					<div className="flex items-center">
						<div className="flex items-center gap-4">
							<h1 className="text-xl tracking-tight text-primary-fg">Primary Sales Dashboard</h1>
							<Toggle variant="outline" pressed={filtersCollapsed} onPressedChange={setFiltersCollapsed}>
								<Icon icon={Filter} /> <span>Filters</span>
							</Toggle>
						</div>
					</div>
					<div>
						<Collapsible open={filtersCollapsed} onOpenChange={setFiltersCollapsed}>
							<CollapsibleContent className="mt-4">
								<Filters />
							</CollapsibleContent>
						</Collapsible>
					</div>
				</div>

				<div></div>
			</div>
		</div>
	);
}
