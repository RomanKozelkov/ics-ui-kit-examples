import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { OfftakeCard } from "./ui/cards/Card";
import { GrowthDriversChart } from "./ui/charts/ChartGrowthDrivers";
import { TrendChart } from "./ui/charts/TrendChart";
import { DashboardHeader } from "./ui/components/DashboardHeader";
import { DataGridTopBrands } from "./ui/datagrids/DataGridTopBrands";
import { DataGridTopDistributors } from "./ui/datagrids/DataGridTopDistributors";
import { DataGridTopRegions } from "./ui/datagrids/DataGridTopRegions";
import { Filters } from "./ui/filters/Filters";
import { ScrollShadowContainer } from "ics-ui-kit/components/scroll-shadow-container";

export function OfftakeDashboard() {
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
					<DashboardHeader>Offtake</DashboardHeader>
					<Filters />
				</div>
				<ScrollShadowContainer className="flex-1 overflow-auto">
					<div className="container mx-auto">
						<div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
							<OfftakeCard metric="Units" />
							<OfftakeCard metric="RUB" />
							<OfftakeCard metric="USD" />
						</div>

						<div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
							<TrendChart />
							<GrowthDriversChart />
						</div>

						<div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
							<DataGridTopDistributors />
							<DataGridTopBrands />
							<DataGridTopRegions />
						</div>
					</div>
				</ScrollShadowContainer>
			</div>
		</QueryClientProvider>
	);
}
