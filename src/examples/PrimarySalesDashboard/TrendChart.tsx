import { useEffect, useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import { getChartTheme, useThemeKey } from "./chartTheme";

const MONTHS = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];

const CY = [175000, 205000, 235000, 290000, 315000, 325000, 330000, 335000, 305000, 245000, 165000, 135000];
const PY = [180000, 215000, 255000, 270000, 280000, 285000, 295000, 300000, 285000, 230000, 170000, 145000];

const YOY = CY.map((v, i) => Number((((v - PY[i]) / PY[i]) * 100).toFixed(1)));

export function TrendChart() {
	const [mounted, setMounted] = useState(false);
	const themeKey = useThemeKey();
	useEffect(() => setMounted(true), []);

	const option = useMemo(() => {
		if (!mounted) return null;
		const t = getChartTheme();
		return {
			backgroundColor: "transparent",
			tooltip: {
				trigger: "axis",
				axisPointer: { type: "cross", label: { backgroundColor: t.tooltipBg } },
				backgroundColor: t.tooltipBg,
				borderColor: t.tooltipBorder,
				textStyle: { color: t.tooltipFg }
			},
			legend: {
				data: [
					{ name: "CY (2025)", icon: "circle" },
					{ name: "PY (2024)", icon: "circle" }
				],
				textStyle: { color: t.textPrimary },
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
					axisLine: { lineStyle: { color: t.grid } },
					axisLabel: { color: t.textSecondary },
					axisTick: { show: false }
				},
				{
					type: "category",
					data: MONTHS,
					gridIndex: 1,
					axisLine: { lineStyle: { color: t.grid } },
					axisLabel: { color: t.textSecondary },
					axisTick: { show: false }
				}
			],
			yAxis: [
				{
					type: "value",
					gridIndex: 0,
					splitLine: { lineStyle: { color: t.gridSoft } },
					axisLabel: {
						color: t.textSecondary,
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
						color: t.textSecondary,
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
					lineStyle: { color: t.info, width: 2.5 },
					itemStyle: { color: t.info },
					areaStyle: {
						color: {
							type: "linear",
							x: 0,
							y: 0,
							x2: 0,
							y2: 1,
							colorStops: [
								{ offset: 0, color: t.infoSoft },
								{ offset: 1, color: t.infoFade }
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
					lineStyle: { color: t.textMuted, width: 1.5, type: "dashed" },
					itemStyle: { color: t.textMuted },
					data: PY
				},
				{
					name: "YoY %",
					type: "bar",
					xAxisIndex: 1,
					yAxisIndex: 1,
					barWidth: "55%",
					itemStyle: {
						color: (params: { value: number }) => (params.value >= 0 ? t.success : t.error),
						borderRadius: [2, 2, 0, 0]
					},
					data: YOY
				}
			]
		};
	}, [mounted, themeKey]);

	if (!mounted || !option) return <div className="h-[420px] w-full" />;

	return (
		<ReactECharts
			key={themeKey}
			option={option}
			style={{ height: 420, width: "100%" }}
			notMerge
			lazyUpdate
		/>
	);
}
