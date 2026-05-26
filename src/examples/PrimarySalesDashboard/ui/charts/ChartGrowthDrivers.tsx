import { useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import {
	SegmentedToggleDivider,
	SegmentedToggleGroup,
	SegmentedToggleItem
} from "../../../../shared/components/SegmentedToggle";
import { useMetricFormat } from "../../utils/useMetricFormat";
import { useDriversChartView, type DriversView as View } from "./useDriversData";
import { useChartColors } from "./useChartColors";
import { useChartFont } from "./useChartFont";

export function GrowthDriversChart() {
	const [view, setView] = useState<View>("products");
	const colors = useChartColors();
	const fontFamily = useChartFont();
	const fmt = useMetricFormat();

	const { data } = useDriversChartView(view);

	const option = useMemo(() => {
		const rows = data ?? [];
		const sorted = [...rows].sort((a, b) => b.diff - a.diff).reverse();
		const categories = sorted.map((d) => d.name);
		const values = sorted.map((d) => d.diff);

		return {
			animation: true,
			textStyle: { fontFamily },
			tooltip: {
				trigger: "axis",
				backgroundColor: colors.tooltipBg,
				borderColor: colors.tooltipBg,
				textStyle: { color: colors.tooltipFg, fontFamily },
				valueFormatter: (v: number | string) => {
					const n = Number(v);
					if (!Number.isFinite(n)) return String(v);
					return fmt.full(n);
				}
			},
			grid: { left: 8, right: 24, top: 16, bottom: 28, containLabel: true },
			xAxis: {
				type: "value",
				axisLine: { lineStyle: { color: colors.grid } },
				splitLine: { lineStyle: { color: colors.grid } },
				axisLabel: { color: colors.text, formatter: (v: number) => fmt.compact(v) }
			},
			yAxis: {
				type: "category",
				data: categories,
				axisLine: { lineStyle: { color: colors.grid } },
				axisLabel: { color: colors.text, fontSize: 11, width: 110, overflow: "truncate" }
			},
			series: [
				{
					type: "bar",
					data: values.map((v) => ({
						value: v,
						itemStyle: {
							color: v >= 0 ? colors.series.positive : colors.series.negative,
							borderRadius: v >= 0 ? [0, 4, 4, 0] : [4, 0, 0, 4]
						}
					})),
					barWidth: "60%"
				}
			]
		};
	}, [data, colors, fontFamily, fmt.metric]);

	return (
		<div className="rounded-xl border-[0.5px] border-primary-border bg-secondary-bg p-4 px-5 shadow-soft-md">
			<div className="mb-2 flex items-center justify-between">
				<div>
					<h2 className="text-base font-medium text-primary-fg">Драйверы роста / падения</h2>
					<p className="text-xs text-secondary-fg">Вклад в изменение продаж (Contribution)</p>
				</div>
				<div>
					<SegmentedToggleGroup type="single" value={view} onValueChange={(v) => v && setView(v as View)}>
						<SegmentedToggleItem value="products">Продукты</SegmentedToggleItem>
						<SegmentedToggleDivider />
						<SegmentedToggleItem value="distributors">Дистрибьюторы</SegmentedToggleItem>
					</SegmentedToggleGroup>
				</div>
			</div>
			<div className="flex h-full flex-col">
				<div className="relative">
					<ReactECharts option={option} style={{ height: 420, width: "100%" }} notMerge lazyUpdate />
				</div>
			</div>
		</div>
	);
}
