import ReactECharts from "echarts-for-react";
import { useMemo } from "react";
import { useFiltersStore } from "../../stores/useFiltersStore";
import { getNumberFormatter } from "../../utils/getNumberFormatter";
import { useTrendChartView } from "./useTrendData";
import { useChartColors } from "./useChartColors";
import { useChartFont } from "./useChartFont";

const compactFormatter = getNumberFormatter(void 0, { notation: "compact", compactDisplay: "short" });
const yoyFormatter = getNumberFormatter(void 0, {
	notation: "compact",
	signDisplay: "auto",
	maximumFractionDigits: 1
});

export function TrendChart() {
	const colors = useChartColors();
	const fontFamily = useChartFont();

	const year = useFiltersStore((s) => s.year);
	const { data } = useTrendChartView();

	const option = useMemo(() => {
		const months = data?.months ?? [];
		const cy = data?.cy ?? [];
		const py = data?.py ?? [];
		const yoy = data?.yoy ?? [];

		return {
			backgroundColor: "transparent",
			textStyle: { fontFamily },
			tooltip: {
				trigger: "axis",
				axisPointer: { type: "none" },
				backgroundColor: colors.tooltipBg,
				borderColor: colors.tooltipBg,
				textStyle: { color: colors.tooltipFg, fontFamily }
			},
			legend: {
				data: [
					{ name: `CY (${year})`, icon: "circle" },
					{ name: `PY (${year - 1})`, icon: "circle" }
				],
				textStyle: { color: colors.textStrong },
				left: 0,
				top: 0,
				itemGap: 16
			},
			axisPointer: { link: [{ xAxisIndex: "all" }] },
			grid: [
				{ left: 50, right: 16, top: 40, height: "55%" },
				{ left: 50, right: 16, top: "75%", height: "18%" }
			],
			xAxis: [
				{
					type: "category",
					data: months,
					gridIndex: 0,
					axisLine: { lineStyle: { color: colors.grid } },
					axisLabel: { color: colors.text },
					axisTick: { show: true }
				},
				{
					type: "category",
					data: months,
					gridIndex: 1,
					axisLine: { lineStyle: { color: colors.grid } },
					axisLabel: { color: colors.text },
					axisTick: { show: true }
				}
			],
			yAxis: [
				{
					type: "value",
					gridIndex: 0,
					splitLine: { lineStyle: { color: colors.grid } },
					axisLabel: {
						color: colors.text,
						formatter: (v: number) => compactFormatter.format(v)
					}
				},
				{
					type: "value",
					gridIndex: 1,
					splitLine: { show: false },
					axisLabel: {
						color: colors.text,
						formatter: (v: number) => `${yoyFormatter.format(v)}%`
					},
					splitNumber: 2
				}
			],
			series: [
				{
					name: `CY (${year})`,
					type: "line",
					smooth: true,
					symbol: "circle",
					symbolSize: 6,
					showSymbol: false,
					lineStyle: { color: colors.series.primary, width: 2.5 },
					itemStyle: { color: colors.series.primary },
					areaStyle: {
						color: {
							type: "linear",
							x: 0,
							y: 0,
							x2: 0,
							y2: 1,
							colorStops: [
								{ offset: 0, color: colors.series.primarySoft },
								{ offset: 1, color: colors.series.primaryFade }
							]
						}
					},
					data: cy
				},
				{
					name: `PY (${year - 1})`,
					type: "line",
					smooth: true,
					symbol: "circle",
					symbolSize: 6,
					showSymbol: false,
					lineStyle: { color: colors.series.muted, width: 1.5, type: "dashed" },
					itemStyle: { color: colors.series.muted },
					data: py
				},
				{
					name: "YoY %",
					type: "bar",
					xAxisIndex: 1,
					yAxisIndex: 1,
					barWidth: "55%",
					itemStyle: {
						color: (params: { value: number }) =>
							params.value >= 0 ? colors.series.positive : colors.series.negative,
						borderRadius: [2, 2, 0, 0]
					},
					data: yoy
				}
			]
		};
	}, [data, year, colors, fontFamily]);

	return (
		<div className="relative">
			<ReactECharts option={option} style={{ height: 420, width: "100%" }} notMerge lazyUpdate />
		</div>
	);
}
