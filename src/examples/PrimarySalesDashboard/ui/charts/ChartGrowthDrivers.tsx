import { useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import { DashboardCard } from "../../../../shared/components/DashboardCard";
import { StaleOverlay } from "../../../../shared/components/StaleOverlay";
import {
	SegmentedToggleDivider,
	SegmentedToggleGroup,
	SegmentedToggleItem
} from "../../../../shared/components/SegmentedToggle";
import { formatPercent } from "../../utils/metricFormat";
import { useMetricFormat } from "../../utils/useMetricFormat";
import { useDriversChartView, type DriversView as View } from "./useDriversData";
import { useChartColors } from "./useChartColors";
import { useChartFont } from "./useChartFont";

type Measure = "value" | "pct";

export function GrowthDriversChart() {
	const [view, setView] = useState<View>("products");
	const [measure, setMeasure] = useState<Measure>("value");
	const colors = useChartColors();
	const fontFamily = useChartFont();
	const fmt = useMetricFormat();

	const { data, isStale } = useDriversChartView(view);

	const option = useMemo(() => {
		const rows = data ?? [];
		const sortKey = (d: { diff: number; pct: number | null }) =>
			measure === "pct" ? (d.pct ?? Number.NEGATIVE_INFINITY) : d.diff;
		const sorted = [...rows].sort((a, b) => sortKey(b) - sortKey(a)).reverse();
		const categories = sorted.map((d) => d.name);

		return {
			animation: true,
			textStyle: { fontFamily },
			tooltip: {
				trigger: "axis",
				backgroundColor: colors.tooltipBg,
				borderColor: colors.tooltipBg,
				textStyle: { color: colors.tooltipFg, fontFamily },
				formatter: (params: Array<{ dataIndex: number; marker: string; name: string }>) => {
					const p = params[0];
					if (!p) return "";
					const row = sorted[p.dataIndex];
					const valueLine = `${p.marker}Значение: ${fmt.full(row.diff)}`;
					const pctLine = `Динамика: ${row.pct == null ? "—" : formatPercent(row.pct, { signed: true })}`;
					return `${row.name}<br/>${valueLine}<br/>${pctLine}`;
				}
			},
			grid: { left: 8, right: 24, top: 16, bottom: 28, containLabel: true },
			xAxis: {
				type: "value",
				axisLine: { lineStyle: { color: colors.grid } },
				splitLine: { lineStyle: { color: colors.grid } },
				axisLabel: {
					color: colors.text,
					formatter: (v: number) =>
						measure === "pct" ? formatPercent(v, { signed: true }) : fmt.compact(v)
				}
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
					data: sorted.map((d) => {
						const v = measure === "pct" ? d.pct : d.diff;
						const positive = (v ?? 0) >= 0;
						return {
							value: v,
							itemStyle: {
								color: positive ? colors.series.positive : colors.series.negative,
								borderRadius: positive ? [0, 4, 4, 0] : [4, 0, 0, 4]
							}
						};
					}),
					barWidth: "60%"
				}
			]
		};
	}, [data, colors, fontFamily, fmt.metric, measure]);

	return (
		<DashboardCard
			title="Драйверы роста / падения"
			subtitle="Вклад в изменение продаж (Contribution)"
			actions={
				<div className="flex items-center gap-3">
					<SegmentedToggleGroup type="single" value={view} onValueChange={(v) => v && setView(v as View)}>
						<SegmentedToggleItem value="products">Продукты</SegmentedToggleItem>
						<SegmentedToggleDivider />
						<SegmentedToggleItem value="distributors">Дистрибьюторы</SegmentedToggleItem>
					</SegmentedToggleGroup>
					<SegmentedToggleGroup
						type="single"
						value={measure}
						onValueChange={(v) => v && setMeasure(v as Measure)}
					>
						<SegmentedToggleItem value="value">Значение</SegmentedToggleItem>
						<SegmentedToggleDivider />
						<SegmentedToggleItem value="pct">%</SegmentedToggleItem>
					</SegmentedToggleGroup>
				</div>
			}
		>
			<div className="flex h-full flex-col">
				<StaleOverlay isStale={isStale}>
					<ReactECharts option={option} style={{ height: 420, width: "100%" }} lazyUpdate />
				</StaleOverlay>
			</div>
		</DashboardCard>
	);
}
