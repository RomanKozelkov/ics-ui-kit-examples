import { useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import { DashboardCard } from "../../shared/components/DashboardCard";
import {
	SegmentedToggleDivider,
	SegmentedToggleGroup,
	SegmentedToggleItem
} from "../../shared/components/SegmentedToggle";
import { useChartFont } from "../../shared/bi-dashboard/charts/useChartFont";
import { tokenToHsla, useThemeTokensRecord } from "../../shared/theme";
import { SALES_BY_CHANNEL } from "./salesData";

const TOKENS = [
	"--muted",
	"--primary-fg",
	"--primary-bg",
	"--alpha-high-80",
	"--chart-1",
	"--chart-2",
	"--chart-3",
	"--chart-4"
] as const;

/** Режим сортировки легенды — не влияет на порядок сегментов диаграммы. */
type LegendSort = "alpha-asc" | "alpha-desc" | "value-asc" | "value-desc";

const numberFormat = new Intl.NumberFormat("ru-RU");

function formatPct(value: number, total: number) {
	return `${((value / total) * 100).toFixed(1)}%`;
}

/**
 * Лучевая (двухкольцевая) диаграмма с независимой сортировкой легенды.
 *
 * Сегменты обоих колец всегда отсортированы по убыванию значения, а порядок
 * элементов легенды управляется отдельно (`legend.data` в ECharts): по алфавиту
 * или по значению, asc/desc. Это решает кейс, когда для сегментов и легенды
 * нельзя использовать одну и ту же отсортированную выборку.
 */
export function DonutLegendSort() {
	const [legendSort, setLegendSort] = useState<LegendSort>("value-desc");
	const fontFamily = useChartFont();
	const t = useThemeTokensRecord(TOKENS);

	const option = useMemo(() => {
		const groupColors = [
			tokenToHsla(t["--chart-1"]),
			tokenToHsla(t["--chart-2"]),
			tokenToHsla(t["--chart-3"]),
			tokenToHsla(t["--chart-4"])
		];
		const textColor = tokenToHsla(t["--muted"]);
		const textStrong = tokenToHsla(t["--primary-fg"]);

		// Группы и каналы внутри групп — всегда по убыванию значения (как сегменты на макете)
		const groups = SALES_BY_CHANNEL.map((g) => ({
			...g,
			value: g.children.reduce((sum, c) => sum + c.value, 0),
			children: [...g.children].sort((a, b) => b.value - a.value)
		})).sort((a, b) => b.value - a.value);

		const total = groups.reduce((sum, g) => sum + g.value, 0);

		const innerData = groups.map((g, i) => ({
			name: g.name,
			value: g.value,
			itemStyle: { color: groupColors[i % groupColors.length] }
		}));
		const outerData = groups.flatMap((g, i) =>
			g.children.map((c) => ({
				name: c.name,
				value: c.value,
				itemStyle: { color: groupColors[i % groupColors.length] }
			}))
		);

		// Порядок в легенде задаётся отдельно от порядка сегментов через legend.data
		const legendItems = [...outerData];
		legendItems.sort((a, b) => {
			switch (legendSort) {
				case "alpha-asc":
					return a.name.localeCompare(b.name);
				case "alpha-desc":
					return b.name.localeCompare(a.name);
				case "value-asc":
					return a.value - b.value;
				case "value-desc":
					return b.value - a.value;
			}
		});
		const legendPct = new Map(outerData.map((d) => [d.name, formatPct(d.value, total)]));

		const insideLabel = (minPct: number) => ({
			show: true,
			position: "inside" as const,
			formatter: (p: { name: string; percent: number }) =>
				p.percent >= minPct ? `${p.name}\n${p.percent.toFixed(1)}%` : "",
			color: "#fff",
			fontSize: 11,
			fontWeight: 600 as const,
			lineHeight: 14
		});

		return {
			animation: true,
			textStyle: { fontFamily },
			tooltip: {
				trigger: "item",
				backgroundColor: `hsl(${t["--alpha-high-80"]})`,
				borderWidth: 0,
				textStyle: { color: tokenToHsla(t["--primary-bg"]), fontFamily },
				extraCssText: "border-radius: var(--radius)",
				valueFormatter: (v: number) => `${numberFormat.format(v)} (${formatPct(v, total)})`
			},
			legend: {
				// Независимая сортировка: меняем только порядок имён, данные серий не трогаем
				data: legendItems.map((d) => d.name),
				orient: "vertical",
				right: 0,
				top: "middle",
				icon: "circle",
				selectedMode: false,
				itemGap: 10,
				textStyle: { color: textColor, fontFamily },
				formatter: (name: string) => `${name} — ${legendPct.get(name) ?? ""}`
			},
			title: {
				text: numberFormat.format(total),
				left: "29%",
				top: "middle",
				textAlign: "center",
				textStyle: { color: textStrong, fontSize: 16, fontWeight: 700, fontFamily }
			},
			series: [
				{
					name: "Группы каналов",
					type: "pie",
					center: ["30%", "50%"],
					radius: ["28%", "58%"],
					sort: "none",
					data: innerData,
					label: insideLabel(8),
					labelLine: { show: false },
					itemStyle: { borderColor: tokenToHsla(t["--primary-bg"]), borderWidth: 1 }
				},
				{
					name: "Каналы",
					type: "pie",
					center: ["30%", "50%"],
					radius: ["62%", "88%"],
					sort: "none",
					data: outerData,
					label: insideLabel(5),
					labelLine: { show: false },
					itemStyle: { borderColor: tokenToHsla(t["--primary-bg"]), borderWidth: 1 }
				}
			]
		};
	}, [legendSort, fontFamily, t]);

	return (
		<div className="container mx-auto max-w-3xl p-4">
			<DashboardCard
				title="Продажи по каналам"
				subtitle="Сортировка легенды отдельно от сегментов"
				actions={
					<SegmentedToggleGroup
						type="single"
						value={legendSort}
						onValueChange={(v) => v && setLegendSort(v as LegendSort)}
					>
						<SegmentedToggleItem value="alpha-asc">А→Я</SegmentedToggleItem>
						<SegmentedToggleDivider />
						<SegmentedToggleItem value="alpha-desc">Я→А</SegmentedToggleItem>
						<SegmentedToggleDivider />
						<SegmentedToggleItem value="value-asc">Значение ↑</SegmentedToggleItem>
						<SegmentedToggleDivider />
						<SegmentedToggleItem value="value-desc">Значение ↓</SegmentedToggleItem>
					</SegmentedToggleGroup>
				}
			>
				<ReactECharts option={option} style={{ height: 420, width: "100%" }} lazyUpdate />
			</DashboardCard>
		</div>
	);
}
