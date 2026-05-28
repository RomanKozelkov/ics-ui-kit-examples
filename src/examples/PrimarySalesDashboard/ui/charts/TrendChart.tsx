import ReactECharts from "echarts-for-react";
import { useMemo, useState } from "react";
import { DashboardCard } from "../../../../shared/components/DashboardCard";
import { StaleOverlay } from "../../../../shared/components/StaleOverlay";
import {
	SegmentedToggleDivider,
	SegmentedToggleGroup,
	SegmentedToggleItem
} from "../../../../shared/components/SegmentedToggle";
import { useFiltersStore } from "../../stores/useFiltersStore";
import { formatPercent } from "../../utils/metricFormat";
import { useMetricFormat } from "../../utils/useMetricFormat";
import { useTrendChartView } from "./useTrendData";
import { useChartColors } from "./useChartColors";
import { useChartFont } from "./useChartFont";

type TrendView = "trend" | "cumulative";

function runningSum(values: Array<number | null>): Array<number | null> {
	let acc = 0;
	let started = false;
	return values.map((v) => {
		if (v == null) return started ? acc : null;
		acc += v;
		started = true;
		return acc;
	});
}

export function TrendChart() {
	const [view, setView] = useState<TrendView>("trend");
	const colors = useChartColors();
	const fontFamily = useChartFont();

	const year = useFiltersStore((s) => s.year);
	const fmt = useMetricFormat();
	const { data, isStale } = useTrendChartView();

	const option = useMemo(() => {
		const months = data?.months ?? [];
		const rawCy = data?.cy ?? [];
		const rawPy = data?.py ?? [];
		const cy = view === "cumulative" ? runningSum(rawCy) : rawCy;
		const py = view === "cumulative" ? runningSum(rawPy) : rawPy;
		const yoy =
			view === "cumulative"
				? cy.map((c, i) => {
						const p = py[i];
						if (c == null || p == null || p === 0) return null;
						return Number((((c - p) / p) * 100).toFixed(1));
					})
				: (data?.yoy ?? []);

		return {
			backgroundColor: "transparent",
			textStyle: { fontFamily },
			tooltip: {
				trigger: "axis",
				backgroundColor: colors.tooltipBg,
				borderColor: colors.tooltipBg,
				borderWidth: 0,
				extraCssText: "border-radius: var(--radius)",
				textStyle: { color: colors.tooltipFg, fontFamily },
				formatter: (
					params: Array<{ axisValue: string; dataIndex: number; marker: string; seriesName: string }>
				) => {
					const p = params[0];
					if (!p) return "";
					const i = p.dataIndex;
					const markerOf = (name: string) => params.find((it) => it.seriesName === name)?.marker ?? "";
					const c = cy[i];
					const pv = py[i];
					const y = yoy[i];
					const valueCell = "text-align:right;padding-left:16px;font-variant-numeric:tabular-nums";
					const row = (label: string, value: string) =>
						`<tr><td>${label}</td><td style="${valueCell}">${value}</td></tr>`;
					const rows = [
						row(`${markerOf(`CY (${year})`)}CY (${year})`, c == null ? "—" : fmt.full(c)),
						row(`${markerOf(`PY (${year - 1})`)}PY (${year - 1})`, pv == null ? "—" : fmt.full(pv)),
						row(`${markerOf("YoY")}YoY %`, y == null ? "—" : formatPercent(y, { signed: true }))
					].join("");
					return `<div>${p.axisValue}</div><table style="border-collapse:collapse;margin-top:4px"><tbody>${rows}</tbody></table>`;
				}
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
						formatter: (v: number) => fmt.compact(v)
					}
				},
				{
					type: "value",
					gridIndex: 1,
					splitLine: { show: false },
					axisLabel: {
						color: colors.text,
						formatter: (v: number) => formatPercent(v, { signed: true })
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
					name: "YoY",
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
	}, [data, year, colors, fontFamily, fmt.metric, view]);

	return (
		<DashboardCard
			title="Тренд Primary Sales"
			subtitle="Помесячная динамика с YoY%"
			actions={
				<SegmentedToggleGroup
					type="single"
					value={view}
					onValueChange={(v) => v && setView(v as TrendView)}
				>
					<SegmentedToggleItem value="trend">Тренд</SegmentedToggleItem>
					<SegmentedToggleDivider />
					<SegmentedToggleItem value="cumulative">Накопительный</SegmentedToggleItem>
				</SegmentedToggleGroup>
			}
		>
			<StaleOverlay isStale={isStale}>
				<ReactECharts option={option} style={{ height: 420, width: "100%" }} lazyUpdate />
			</StaleOverlay>
		</DashboardCard>
	);
}
