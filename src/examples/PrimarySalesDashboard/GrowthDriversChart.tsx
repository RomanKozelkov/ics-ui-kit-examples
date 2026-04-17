import { useEffect, useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import { ToggleGroup, ToggleGroupItem } from "ics-ui-kit/components/toggle-group";
import { getChartTheme, useThemeKey } from "./chartTheme";

type View = "products" | "distributors";

const PRODUCTS: { name: string; value: number }[] = [
	{ name: "Амоксициллин 500мг", value: 2100000 },
	{ name: "Ибупрофен 400мг", value: 1550000 },
	{ name: "Омепразол 20мг", value: 1150000 },
	{ name: "Цефтриаксон 1г", value: 980000 },
	{ name: "Метформин 850мг", value: 820000 },
	{ name: "Азитромицин 250мг", value: 680000 },
	{ name: "Лозартан 50мг", value: 460000 },
	{ name: "Нимесулид 100мг", value: -180000 },
	{ name: "Диклофенак 75мг", value: -290000 },
	{ name: "Кларитромицин 500мг", value: -360000 },
	{ name: "Парацетамол 500мг", value: -440000 },
	{ name: "Аторвастатин 20мг", value: -680000 }
];

const DISTRIBUTORS: { name: string; value: number }[] = [
	{ name: "Протек", value: 1850000 },
	{ name: "Катрен", value: 1320000 },
	{ name: "Пульс", value: 910000 },
	{ name: "ФК Гранд Капитал", value: 640000 },
	{ name: "Р-Фарм", value: 480000 },
	{ name: "Профитмед", value: 310000 },
	{ name: "БСС", value: -220000 },
	{ name: "Гален", value: -340000 },
	{ name: "Морон", value: -520000 },
	{ name: "Фармкомплект", value: -780000 }
];

function formatRub(v: number) {
	const abs = Math.abs(v);
	if (abs >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M ₽`;
	if (abs >= 1_000) return `${Math.round(v / 1_000)}K ₽`;
	return `${v} ₽`;
}

export function GrowthDriversChart() {
	const [mounted, setMounted] = useState(false);
	const [view, setView] = useState<View>("products");
	const themeKey = useThemeKey();
	useEffect(() => setMounted(true), []);

	const option = useMemo(() => {
		if (!mounted) return null;
		const t = getChartTheme();
		const data = view === "products" ? PRODUCTS : DISTRIBUTORS;
		const sorted = [...data].sort((a, b) => b.value - a.value);
		const categories = sorted.map((d) => d.name).reverse();
		const values = sorted.map((d) => d.value).reverse();

		return {
			backgroundColor: "transparent",
			tooltip: {
				trigger: "axis",
				axisPointer: { type: "shadow" },
				backgroundColor: t.tooltipBg,
				borderColor: t.tooltipBorder,
				textStyle: { color: t.tooltipFg },
				formatter: (params: { name: string; value: number }[]) => {
					const p = params[0];
					return `${p.name}<br/><b>${formatRub(p.value)}</b>`;
				}
			},
			legend: {
				data: [
					{ name: "Рост", icon: "circle" },
					{ name: "Падение", icon: "circle" }
				],
				textStyle: { color: t.textPrimary },
				left: 0,
				top: 0,
				itemGap: 16
			},
			grid: { left: 8, right: 24, top: 40, bottom: 28, containLabel: true },
			xAxis: {
				type: "value",
				axisLine: { show: false },
				axisTick: { show: false },
				splitLine: { lineStyle: { color: t.gridSoft } },
				axisLabel: {
					color: t.textSecondary,
					formatter: (v: number) => formatRub(v)
				}
			},
			yAxis: {
				type: "category",
				data: categories,
				axisLine: { show: false },
				axisTick: { show: false },
				axisLabel: {
					color: t.textPrimary,
					fontSize: 11,
					width: 110,
					overflow: "break"
				}
			},
			series: [
				{
					name: "Value",
					type: "bar",
					data: values.map((v) => ({
						value: v,
						itemStyle: {
							color: v >= 0 ? t.success : t.error,
							borderRadius: v >= 0 ? [0, 4, 4, 0] : [4, 0, 0, 4]
						}
					})),
					barWidth: "60%"
				},
				{ name: "Рост", type: "bar", data: [], itemStyle: { color: t.success } },
				{ name: "Падение", type: "bar", data: [], itemStyle: { color: t.error } }
			]
		};
	}, [mounted, view, themeKey]);

	return (
		<div className="flex h-full flex-col">
			<div className="mb-2 flex items-center justify-end">
				<ToggleGroup
					type="single"
					value={view}
					onValueChange={(v) => v && setView(v as View)}
					variant="outline"
					size="sm"
				>
					<ToggleGroupItem value="products">Продукты</ToggleGroupItem>
					<ToggleGroupItem value="distributors">Дистрибьюторы</ToggleGroupItem>
				</ToggleGroup>
			</div>
			{mounted && option ? (
				<ReactECharts
					key={themeKey}
					option={option}
					style={{ height: 420, width: "100%" }}
					notMerge
					lazyUpdate
				/>
			) : (
				<div className="h-[420px] w-full" />
			)}
		</div>
	);
}
