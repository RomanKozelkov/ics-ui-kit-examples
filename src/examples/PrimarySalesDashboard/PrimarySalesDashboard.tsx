import { Collapsible, CollapsibleContent } from "ics-ui-kit/components/collapsible";
import { Icon } from "ics-ui-kit/components/icon";
import { Toggle } from "ics-ui-kit/components/toggle";
import { ChevronDown, ChevronRight, ChevronUp, Filter } from "lucide-react";
import { useState } from "react";
import { Filters } from "./Filters";
import { GrowthDriversChart } from "./ChartGrowthDrivers";
import { PrimarySalesValueCard } from "./CardValue";
import { PrimarySalesUnitsCard } from "./CardUnits";
import { TrendChart } from "./TrendChart";
import { DataGridTopDistributors } from "./DataGridTopDistributors";
import { DataGridTopBrands } from "./DataGridTopBrands";
import { TriggerButton } from "ics-ui-kit/components/button";
import { cn } from "ics-ui-kit/lib/utils";
export function PrimarySalesDashboard() {
	const [filtersCollapsed, setFiltersCollapsed] = useState(false);

	return (
		<div className="h-full w-full bg-primary-bg">
			<div className="container mx-auto py-8">
				<div className="mb-4 flex items-center">
					<div>
						<h1 className="text-2xl font-semibold tracking-tight text-primary-fg">Primary Sales</h1>
					</div>
					<div className="ml-auto">
						<TriggerButton
							onClick={() => setFiltersCollapsed(!filtersCollapsed)}
							startIcon={Filter}
							className={cn(filtersCollapsed ? "bg-secondary-bg-hover shadow-none" : "")}
						>
							Фильтры
							{filtersCollapsed ? <Icon icon={ChevronUp} /> : <Icon icon={ChevronDown} />}
						</TriggerButton>
					</div>
				</div>

				<Collapsible open={filtersCollapsed} onOpenChange={setFiltersCollapsed}>
					<CollapsibleContent>
						<div className="flex flex-col rounded-xl border border-secondary-border bg-secondary-bg p-4">
							<Filters />
						</div>
					</CollapsibleContent>
				</Collapsible>

				<div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
					<PrimarySalesValueCard />
					<PrimarySalesUnitsCard />
				</div>

				<div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
					<div className="rounded-xl border border-secondary-border bg-secondary-bg p-4">
						<div className="mb-2">
							<h2 className="text-base font-medium text-primary-fg">Тренд Primary Sales</h2>
							<p className="text-xs text-secondary-fg">Помесячная динамика с YoY%</p>
						</div>
						<TrendChart />
					</div>
					<div className="rounded-xl border border-secondary-border bg-secondary-bg p-4">
						<div className="mb-2">
							<h2 className="text-base font-medium text-primary-fg">Драйверы роста / падения</h2>
							<p className="text-xs text-secondary-fg">Вклад в изменение продаж (Contribution)</p>
						</div>
						<GrowthDriversChart />
					</div>
				</div>

				<div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
					<DataGridTopDistributors />
					<DataGridTopBrands />
				</div>
			</div>
		</div>
	);
}
