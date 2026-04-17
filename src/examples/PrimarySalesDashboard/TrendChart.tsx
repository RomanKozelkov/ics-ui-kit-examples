import { useEffect, useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";

const MONTHS = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];

const CY = [175000, 205000, 235000, 290000, 315000, 325000, 330000, 335000, 305000, 245000, 165000, 135000];
const PY = [180000, 215000, 255000, 270000, 280000, 285000, 295000, 300000, 285000, 230000, 170000, 145000];

const YOY = CY.map((v, i) => Number((((v - PY[i]) / PY[i]) * 100).toFixed(1)));

const COLORS = {
	text: "#6b7280",
	textStrong: "#111827",
	grid: "#e5e7eb",
	info: "#3b82f6",
	infoSoft: "rgba(59, 130, 246, 0.35)",
	infoFade: "rgba(59, 130, 246, 0)",
	muted: "#9ca3af",
	success: "#10b981",
	error: "#ef4444",
	tooltipBg: "#111827",
	tooltipFg: "#f9fafb"
};

export function TrendChart() {
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);

	const option = useMemo(
		() => ({
			backgroundColor: "transparent",
			animation: false,
			tooltip: {
				trigger: "axis",
				axisPointer: { type: "cross" },
				backgroundColor: COLORS.tooltipBg,
				borderColor: COLORS.tooltipBg,
				textStyle: { color: COLORS.tooltipFg }
			},
			legend: {
				data: [
					{ name: "CY (2025)", icon: "circle" },
					{ name: "PY (2024)", icon: "circle" }
				],
				textStyle: { color: COLORS.textStrong },
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
					data: MONTHS,
					gridIndex: 0,
					axisLine: { lineStyle: { color: COLORS.grid } },
					axisLabel: { color: COLORS.text },
					axisTick: { show: false }
				},
				{
					type: "category",
					data: MONTHS,
					gridIndex: 1,
					axisLine: { lineStyle: { color: COLORS.grid } },
					axisLabel: { color: COLORS.text },
					axisTick: { show: false }
				}
			],
			yAxis: [
				{
					type: "value",
					gridIndex: 0,
					splitLine: { lineStyle: { color: COLORS.grid } },
					axisLabel: {
						color: COLORS.text,
						formatter: (v: number) => v.toLocaleString("ru-RU")
					},
					min: 0,
					max: 340000,
					interval: 85000
				},
				{
					type: "value",
					gridIndex: 1,
					splitLine: { show: false },
					axisLabel: {
						color: COLORS.text,
						formatter: (v: number) => `${v}%`
					},
					splitNumber: 2
				}
			],
			series: [
				{
					name: "CY (2025)",
					type: "line",
					smooth: true,
					symbol: "circle",
					symbolSize: 6,
					showSymbol: false,
					lineStyle: { color: COLORS.info, width: 2.5 },
					itemStyle: { color: COLORS.info },
					areaStyle: {
						color: {
							type: "linear",
							x: 0,
							y: 0,
							x2: 0,
							y2: 1,
							colorStops: [
								{ offset: 0, color: COLORS.infoSoft },
								{ offset: 1, color: COLORS.infoFade }
							]
						}
					},
					data: CY
				},
				{
					name: "PY (2024)",
					type: "line",
					smooth: true,
					symbol: "none",
					lineStyle: { color: COLORS.muted, width: 1.5, type: "dashed" },
					itemStyle: { color: COLORS.muted },
					data: PY
				},
				{
					name: "YoY %",
					type: "bar",
					xAxisIndex: 1,
					yAxisIndex: 1,
					barWidth: "55%",
					itemStyle: {
						color: (params: { value: number }) => (params.value >= 0 ? COLORS.success : COLORS.error),
						borderRadius: [2, 2, 0, 0]
					},
					data: YOY
				}
			]
		}),
		[]
	);

	if (!mounted) return <div className="h-[420px] w-full" />;

	return <ReactECharts option={option} style={{ height: 420, width: "100%" }} notMerge lazyUpdate />;
}
