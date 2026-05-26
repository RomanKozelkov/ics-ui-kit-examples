import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { PrimarySalesUnitsCard } from "./ui/cards/CardUnits";
import { PrimarySalesValueCard } from "./ui/cards/CardValue";
import { GrowthDriversChart } from "./ui/charts/ChartGrowthDrivers";
import { TrendChart } from "./ui/charts/TrendChart";
import { DashboardHeader } from "./ui/components/DashboardHeader";
import { DataGridTopBrands } from "./ui/datagrids/DataGridTopBrands";
import { DataGridTopDistributors } from "./ui/datagrids/DataGridTopDistributors";
import { Filters } from "./ui/filters/Filters";
import { ScrollShadowContainer } from "ics-ui-kit/components/scroll-shadow-container";

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

	return (
		<QueryClientProvider client={queryClient}>
			<div className="flex h-full w-full flex-col overflow-auto bg-primary-bg pb-2 pt-8">
				<div className="container mx-auto flex flex-shrink-0 items-center gap-4 pb-4">
					<DashboardHeader>Primary Sales</DashboardHeader>
					<Filters />
				</div>
				<ScrollShadowContainer className="flex-1 overflow-auto">
					<div className="container mx-auto">
						<div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
							<PrimarySalesUnitsCard />
							<PrimarySalesValueCard currency="RUB" />
							<PrimarySalesValueCard currency="USD" />
						</div>

						<div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
							<div className="rounded-xl border-[0.5px] border-primary-border bg-secondary-bg p-4 px-5 shadow-soft-md">
								<div className="mb-2">
									<h2 className="text-base font-medium text-primary-fg">Тренд Primary Sales</h2>
									<p className="text-xs text-secondary-fg">Помесячная динамика с YoY%</p>
								</div>
								<TrendChart />
							</div>
							<GrowthDriversChart />
						</div>

						<div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
							<DataGridTopDistributors />
							<DataGridTopBrands />
						</div>
					</div>
				</ScrollShadowContainer>
			</div>
		</QueryClientProvider>
	);
}
