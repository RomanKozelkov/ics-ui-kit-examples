import { useState } from "react";
import { GrowthDriversChart as GrowthDriversChartView } from "../../../../shared/bi-dashboard/charts/GrowthDriversChart";
import { useFiltersStore } from "../../stores/useFiltersStore";
import { useMetricFormat } from "../../utils/useMetricFormat";
import { useDriversChartView, type DriversView } from "./useDriversData";

const VIEW_OPTIONS = [
	{ value: "products", label: "Продукты" },
	{ value: "distributors", label: "Дистрибьюторы" }
];

export function GrowthDriversChart() {
	const [view, setView] = useState<DriversView>("products");
	const year = useFiltersStore((s) => s.year);
	const fmt = useMetricFormat();
	const { data, isStale } = useDriversChartView(view);

	return (
		<GrowthDriversChartView
			year={year}
			fmt={fmt}
			view={view}
			onViewChange={(v) => setView(v as DriversView)}
			viewOptions={VIEW_OPTIONS}
			data={data}
			isStale={isStale}
		/>
	);
}
