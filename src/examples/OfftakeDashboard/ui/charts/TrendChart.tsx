import { TrendChart as TrendChartView } from "../../../../shared/bi-dashboard/charts/TrendChart";
import { useFiltersStore } from "../../stores/useFiltersStore";
import { useMetricFormat } from "../../utils/useMetricFormat";
import { useTrendChartView } from "./useTrendData";

export function TrendChart() {
	const year = useFiltersStore((s) => s.year);
	const fmt = useMetricFormat();
	const { data, isStale } = useTrendChartView();

	return <TrendChartView title="Тренд Offtake" year={year} fmt={fmt} data={data} isStale={isStale} />;
}
