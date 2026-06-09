import { useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import { DashboardCard } from "../../components/DashboardCard";
import { StaleOverlay } from "../../components/StaleOverlay";
import {
	SegmentedToggleDivider,
	SegmentedToggleGroup,
	SegmentedToggleItem
} from "../../components/SegmentedToggle";
import { formatPercent, type useMetricFormat } from "../format";
import { useChartColors } from "./useChartColors";
import { useChartFont } from "./useChartFont";

/** Строка драйвера роста/падения: вклад в изменение продаж. Готовит `useDriversChartView`. */
export type DriverRow = { name: string; cy: number; py: number; diff: number; pct: number | null };

type MetricFormat = ReturnType<typeof useMetricFormat>;
type Measure = "value" | "pct";

/** Опция переключателя разреза (продукты/дистрибьюторы/регионы) — набор задаёт дашборд. */
export type DriversViewOption = { value: string; label: string };

type GrowthDriversChartProps = {
	year: number;
	fmt: MetricFormat;
	/** Текущий разрез. Управляется обёрткой, т.к. от него зависит запрос. */
	view: string;
	onViewChange: (view: string) => void;
	viewOptions: DriversViewOption[];
	data: DriverRow[] | undefined;
	isStale: boolean;
};

/**
 * Презентационный график драйверов роста/падения: горизонтальные бары вклада (YoY / YoY %).
 * Данные и набор разрезов приходят пропсами — стор/запросы живут в обёртке дашборда.
 */
export function GrowthDriversChart({
	year,
	fmt,
	view,
	onViewChange,
	viewOptions,
	data,
	isStale
}: GrowthDriversChartProps) {
	const [measure, setMeasure] = useState<Measure>("value");
	const colors = useChartColors();
	const fontFamily = useChartFont();

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
				borderWidth: 0,
				extraCssText: "border-radius: var(--radius)",
				formatter: (params: Array<{ dataIndex: number; marker: string; name: string }>) => {
					const p = params[0];
					if (!p) return "";
					const row = sorted[p.dataIndex];
					const b = p.marker;
					const valueCell = "text-align:right;padding-left:16px;font-variant-numeric:tabular-nums";
					const tr = (label: string, value: string) =>
						`<tr><td>${b}${label}</td><td style="${valueCell}">${value}</td></tr>`;
					const yoyRow = tr("YoY", fmt.full(row.diff));
					const pctRow = tr("YoY %", row.pct == null ? "—" : formatPercent(row.pct, { signed: true }));
					const cyRow = tr(`CY (${year})`, fmt.full(row.cy));
					const pyRow = tr(`PY (${year - 1})`, fmt.full(row.py));
					const head = measure === "pct" ? [pctRow, yoyRow] : [yoyRow, pctRow];
					const rowsHtml = [...head, cyRow, pyRow].join("");
					return `<div>${row.name}</div><table style="border-collapse:collapse;margin-top:4px"><tbody>${rowsHtml}</tbody></table>`;
				}
			},
			grid: { left: 8, right: 24, top: 16, bottom: 28, containLabel: true },
			xAxis: {
				type: "value",
				axisLine: { lineStyle: { color: colors.grid } },
				splitLine: { lineStyle: { color: colors.grid } },
				axisLabel: {
					color: colors.text,
					formatter: (v: number) => (measure === "pct" ? formatPercent(v, { signed: true }) : fmt.compact(v))
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
	}, [data, year, colors, fontFamily, fmt.metric, measure]);

	return (
		<DashboardCard
			title="Драйверы роста / падения"
			subtitle="Вклад в изменение продаж (Contribution)"
			actions={
				<div className="flex items-center gap-3">
					<SegmentedToggleGroup type="single" value={view} onValueChange={(v) => v && onViewChange(v)}>
						{viewOptions.map((opt, i) => (
							<SegmentedToggleFragment key={opt.value} divider={i > 0}>
								<SegmentedToggleItem value={opt.value}>{opt.label}</SegmentedToggleItem>
							</SegmentedToggleFragment>
						))}
					</SegmentedToggleGroup>
					<SegmentedToggleGroup
						type="single"
						value={measure}
						onValueChange={(v) => v && setMeasure(v as Measure)}
					>
						<SegmentedToggleItem value="value">YoY</SegmentedToggleItem>
						<SegmentedToggleDivider />
						<SegmentedToggleItem value="pct">YoY %</SegmentedToggleItem>
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

function SegmentedToggleFragment({ divider, children }: { divider: boolean; children: React.ReactNode }) {
	return (
		<>
			{divider && <SegmentedToggleDivider />}
			{children}
		</>
	);
}
