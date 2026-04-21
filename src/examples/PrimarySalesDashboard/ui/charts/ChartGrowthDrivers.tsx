import { useEffect, useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import { ToggleGroup, ToggleGroupItem } from "ics-ui-kit/components/toggle-group";
import { useDriversChartView, type DriversView as View } from "./useDriversData";

const SUCCESS = "#10b981";
const ERROR = "#ef4444";

function formatRub(v: number) {
	const abs = Math.abs(v);
	if (abs >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M ₽`;
	if (abs >= 1_000) return `${Math.round(v / 1_000)}K ₽`;
	return `${v} ₽`;
}

export function GrowthDriversChart() {
	const [mounted, setMounted] = useState(false);
	const [view, setView] = useState<View>("products");
	useEffect(() => setMounted(true), []);

	const { data, isLoading } = useDriversChartView(view);

	const option = useMemo(() => {
		const rows = data ?? [];
		const sorted = [...rows].sort((a, b) => b.diff - a.diff).reverse();
		const categories = sorted.map((d) => d.name);
		const values = sorted.map((d) => d.diff);

		return {
			animation: false,
			tooltip: {
				trigger: "item",
				formatter: (p: { name: string; value: number }) => `${p.name}<br/><b>${formatRub(p.value)}</b>`
			},
			grid: { left: 8, right: 24, top: 16, bottom: 28, containLabel: true },
			xAxis: {
				type: "value",
				axisLabel: { formatter: (v: number) => formatRub(v) }
			},
			yAxis: {
				type: "category",
				data: categories,
				axisLabel: { fontSize: 11, width: 110, overflow: "break" }
			},
			series: [
				{
					type: "bar",
					data: values.map((v) => ({
						value: v,
						itemStyle: {
							color: v >= 0 ? SUCCESS : ERROR,
							borderRadius: v >= 0 ? [0, 4, 4, 0] : [4, 0, 0, 4]
						}
					})),
					barWidth: "60%"
				}
			]
		};
	}, [data]);

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
			{mounted ? (
				<div className="relative">
					<ReactECharts option={option} style={{ height: 420, width: "100%" }} notMerge lazyUpdate />
					{isLoading && !data ? (
						<div className="absolute inset-0 flex items-center justify-center text-sm text-secondary-fg">
							Загрузка…
						</div>
					) : null}
				</div>
			) : (
				<div className="h-[420px] w-full" />
			)}
		</div>
	);
}
