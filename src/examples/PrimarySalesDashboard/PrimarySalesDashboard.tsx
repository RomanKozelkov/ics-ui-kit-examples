import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TriggerButton } from "ics-ui-kit/components/button";
import { Icon } from "ics-ui-kit/components/icon";
import { Popover, PopoverContent, PopoverTrigger } from "ics-ui-kit/components/popover";
import { cn } from "ics-ui-kit/lib/utils";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import { useState } from "react";
import { PrimarySalesUnitsCard } from "./ui/cards/CardUnits";
import { PrimarySalesValueCard } from "./ui/cards/CardValue";
import { GrowthDriversChart } from "./ui/charts/ChartGrowthDrivers";
import { TrendChart } from "./ui/charts/TrendChart";
import { DashboardHeader } from "./ui/components/DashboardHeader";
import { DataGridTopBrands } from "./ui/datagrids/DataGridTopBrands";
import { DataGridTopDistributors } from "./ui/datagrids/DataGridTopDistributors";
import { Filters } from "./ui/filters/Filters";

export function PrimarySalesDashboard() {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 60_000
					}
				}
			})
	);

	const [filtersCollapsed, setFiltersCollapsed] = useState(false);

	return (
		<QueryClientProvider client={queryClient}>
			<div className="h-full w-full bg-primary-bg">
				<div className="container mx-auto py-8">
					<div className="mb-4 flex items-center">
						<div>
							<DashboardHeader>Primary Sales</DashboardHeader>
						</div>
						<div className="ml-auto">
							<Popover open={filtersCollapsed} onOpenChange={setFiltersCollapsed}>
								<PopoverTrigger asChild>
									<TriggerButton
										startIcon={Filter}
										className={cn(filtersCollapsed ? "bg-secondary-bg-hover shadow-none" : "")}
									>
										Фильтры
										{filtersCollapsed ? <Icon icon={ChevronUp} /> : <Icon icon={ChevronDown} />}
									</TriggerButton>
								</PopoverTrigger>
								<PopoverContent
									align="end"
									collisionPadding={16}
									className="max-h-[var(--radix-popover-content-available-height)] w-[24rem] overflow-y-auto"
								>
									<Filters />
								</PopoverContent>
							</Popover>
						</div>
					</div>

					<div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
						<PrimarySalesValueCard />
						<PrimarySalesUnitsCard />
					</div>

					<div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
						<div className="rounded-xl border border-secondary-border bg-secondary-bg p-4 px-5">
							<div className="mb-2">
								<h2 className="text-base font-medium text-primary-fg">Тренд Primary Sales</h2>
								<p className="text-xs text-secondary-fg">Помесячная динамика с YoY%</p>
							</div>
							<TrendChart />
						</div>
						<GrowthDriversChart />
					</div>

					<div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
						<DataGridTopDistributors />
						<DataGridTopBrands />
					</div>
				</div>
			</div>
		</QueryClientProvider>
	);
}
