import { useQuery } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import { useFiltersStore } from "../stores/useFiltersStore";
import { primarySalesKeys } from "../api/queryKeys";
import { fetchTrend, type TrendRaw } from "../api/fetchers";
import { YEAR_FIELD } from "../api/tabular";

const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_RU = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];

export type TrendChartData = {
	months: string[];
	cy: Array<number | null>;
	py: Array<number | null>;
	yoy: Array<number | null>;
};

function aggregateTrend(raw: TrendRaw): TrendChartData {
	const cyMap: Record<string, number> = {};
	const pyMap: Record<string, number> = {};
	for (const row of raw.rows) {
		const month = row["Calendar[Month]"] as string;
		const year = row[YEAR_FIELD] as number;
		const value = row[raw.valueField] as number;
		if (year === raw.year) cyMap[month] = value;
		else if (year === raw.year - 1) pyMap[month] = value;
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

export function useTrendChart() {
	const input = useFiltersStore(
		useShallow((s) => ({
			year: s.year,
			metric: s.metric,
			currency: s.currency,
			sourceType: s.sourceType,
			bindType: s.bindType,
			period: s.period,
			counterparties: s.counterparties,
			brands: s.brands
		}))
	);

	return useQuery({
		queryKey: primarySalesKeys.trend(input),
		queryFn: () => fetchTrend(input),
		select: aggregateTrend
	});
}
