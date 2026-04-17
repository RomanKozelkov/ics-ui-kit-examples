import { Collapsible, CollapsibleContent } from "ics-ui-kit/components/collapsible";
import { Icon } from "ics-ui-kit/components/icon";
import { Toggle } from "ics-ui-kit/components/toggle";
import { Filter } from "lucide-react";
import { useState } from "react";
import { Filters } from "./Filters";
import { GrowthDriversChart } from "./GrowthDriversChart";
import { PrimarySalesValueCard } from "./PrimarySalesValueCard";
import { PrimarySalesUnitsCard } from "./PrimarySalesUnitsCard";
import { TrendChart } from "./TrendChart";
import { cn } from "ics-ui-kit/lib/utils";

export function PrimarySalesDashboard() {
	const [filtersCollapsed, setFiltersCollapsed] = useState(false);

	return (
		<div className="h-full w-full bg-primary-bg">
			<div className="container mx-auto py-4">
				<div className="flex flex-col rounded-xl border border-secondary-border bg-secondary-bg p-4">
					<div className="flex items-center">
						<div className="flex items-center gap-4">
							<h1 className="text-xl tracking-tight text-primary-fg">Primary Sales</h1>
							<Toggle variant="outline" pressed={filtersCollapsed} onPressedChange={setFiltersCollapsed}>
								<Icon icon={Filter} /> <span>Фильтры</span>
							</Toggle>
						</div>
					</div>
					<div>
						<Collapsible open={filtersCollapsed} onOpenChange={setFiltersCollapsed}>
							<CollapsibleContent className="pt-4">
								<Filters />
							</CollapsibleContent>
						</Collapsible>
					</div>
				</div>

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
			</div>
		</div>
	);
}
