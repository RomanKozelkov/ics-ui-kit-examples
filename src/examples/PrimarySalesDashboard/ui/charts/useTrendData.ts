import { useQuery } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import { useFiltersStore } from "../../stores/useFiltersStore";
import { primarySalesKeys } from "../../api/queryKeys";
import { fetchTrendData, type TrendDataRaw } from "../../api/fetchers";
import { pickMeasureField, type MeasureField } from "../datagrids/aggregateRanking";

const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_RU = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];

export type TrendChartData = {
	months: string[];
	cy: Array<number | null>;
	py: Array<number | null>;
	yoy: Array<number | null>;
};

function aggregate(raw: TrendDataRaw, field: MeasureField): TrendChartData {
	const cyMap: Record<string, number> = {};
	const pyMap: Record<string, number> = {};
	for (const row of raw.rows) {
		if (!row.month) continue;
		const v = row[field];
		if (row.year === raw.year) cyMap[row.month] = (cyMap[row.month] ?? 0) + v;
		else if (row.year === raw.year - 1) pyMap[row.month] = (pyMap[row.month] ?? 0) + v;
	}
	const cy = MONTHS_EN.map((m) => (m in cyMap ? Math.round(cyMap[m]) : null));
	const py = MONTHS_EN.map((m) => (m in pyMap ? Math.round(pyMap[m]) : null));
	const yoy = cy.map((c, i) => {
		const p = py[i];
		if (c == null || p == null || p === 0) return null;
		return Number((((c - p) / p) * 100).toFixed(1));
	});
	return { months: MONTHS_RU, cy, py, yoy };
}

export function useTrendData() {
	const input = useFiltersStore(
		useShallow((s) => ({
			year: s.year,
			sourceType: s.sourceType,
			bindType: s.bindType,
			period: s.period,
			counterparties: s.counterparties,
			brands: s.brands
		}))
	);

	return useQuery({
		queryKey: primarySalesKeys.trendData(input),
		queryFn: () => fetchTrendData(input)
	});
}

export function useTrendChartView(): { data: TrendChartData | undefined; isLoading: boolean } {
	const metric = useFiltersStore((s) => s.metric);
	const currency = useFiltersStore((s) => s.currency);
	const { data, isLoading } = useTrendData();
	if (!data) return { data: undefined, isLoading };
	return { data: aggregate(data, pickMeasureField(metric, currency)), isLoading };
}
