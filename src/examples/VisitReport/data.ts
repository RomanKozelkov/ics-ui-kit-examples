export type Brand = {
	id: string;
	name: string;
	dotClassName: string;
	barClassName: string;
};

export type CircleMetric = {
	id: string;
	label: string;
	value: number | null;
};

export type MetricRow = {
	brandId: string;
	value: number;
	delta: number;
};

export type MetricTabId = "uniqueSku" | "matrix" | "shelfShare" | "width";

export type MetricTab = {
	id: MetricTabId;
	label: string;
	unit: string;
	total: number;
	totalDelta: number;
	/** Additive metrics (SKU count, width) render a stacked share bar; ratio metrics (%) don't sum to the total. */
	isAdditive: boolean;
	rows: MetricRow[];
};

export const brands: Brand[] = [
	{ id: "7days", name: "7-Days", dotClassName: "bg-blue-500", barClassName: "bg-blue-500" },
	{ id: "dirol", name: "Dirol", dotClassName: "bg-emerald-500", barClassName: "bg-emerald-500" }
];

export const visitSummary = {
	brandsCount: 2,
	skuCount: 14,
	facingsCount: 96,
	comparedVisitDate: "12 мая"
};

export const circleMetrics: CircleMetric[] = [
	{ id: "uniqueSku", label: "Уникальные SKU", value: 62 },
	{ id: "matrix", label: "Матрица", value: 80 },
	{ id: "shelfShare", label: "Доля полки", value: 46 },
	{ id: "linearShare", label: "Линейная доля", value: null }
];

export const metricTabs: MetricTab[] = [
	{
		id: "uniqueSku",
		label: "Уникальные SKU",
		unit: "SKU",
		total: 14,
		totalDelta: 2,
		isAdditive: true,
		rows: [
			{ brandId: "7days", value: 9, delta: 1 },
			{ brandId: "dirol", value: 5, delta: 1 }
		]
	},
	{
		id: "matrix",
		label: "Матрица",
		unit: "%",
		total: 80,
		totalDelta: 8,
		isAdditive: false,
		rows: [
			{ brandId: "7days", value: 90, delta: 10 },
			{ brandId: "dirol", value: 60, delta: 0 }
		]
	},
	{
		id: "shelfShare",
		label: "Доля полки",
		unit: "%",
		total: 46,
		totalDelta: 6,
		isAdditive: false,
		rows: [
			{ brandId: "7days", value: 40, delta: 5 },
			{ brandId: "dirol", value: 6, delta: 1 }
		]
	},
	{
		id: "width",
		label: "Ширина",
		unit: "см",
		total: 320,
		totalDelta: 40,
		isAdditive: true,
		rows: [
			{ brandId: "7days", value: 280, delta: 35 },
			{ brandId: "dirol", value: 40, delta: 5 }
		]
	}
];

export const linearShareHint =
	"Линейная доля недоступна — для этой точки не заданы размеры стеллажа. Параметры задаются на портале в карточке точки продаж.";
