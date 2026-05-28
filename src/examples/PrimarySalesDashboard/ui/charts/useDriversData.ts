import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import { useFiltersStore } from "../../stores/useFiltersStore";
import { primarySalesKeys } from "../../api/queryKeys";
import { fetchBrandsData, fetchDistributorsByBrandData } from "../../api/fetchers";
import { pickMeasureField, type MeasureField } from "../datagrids/aggregateRanking";

export type DriversView = "products" | "distributors";

export type DriverRow = { name: string; diff: number; pct: number | null };

type InputRow = { name: string; year: number; units: number; valueUsd: number; valueRub: number };
type RawData = { year: number; rows: InputRow[] };

function aggregate(raw: RawData, field: MeasureField): DriverRow[] {
	const byName: Record<string, { cur: number; prev: number }> = {};
	for (const row of raw.rows) {
		if (!row.name) continue;
		if (!byName[row.name]) byName[row.name] = { cur: 0, prev: 0 };
		const v = row[field];
		if (row.year === raw.year) byName[row.name].cur += v;
		else if (row.year === raw.year - 1) byName[row.name].prev += v;
	}

	const rows = Object.entries(byName)
		.map(([name, v]) => ({
			name,
			diff: Math.round(v.cur - v.prev),
			pct: v.prev !== 0 ? Number((((v.cur - v.prev) / v.prev) * 100).toFixed(1)) : null
		}))
		.filter((r) => r.diff !== 0)
		.sort((a, b) => b.diff - a.diff);

	const top = rows.slice(0, 5);
	const bottom = rows.slice(-5).filter((r) => !top.includes(r));
	return [...top, ...bottom];
}

export function useDriversData(view: DriversView) {
	const isDistributors = view === "distributors";

	const brandsInput = useFiltersStore(
		useShallow((s) => ({
			year: s.year,
			sourceType: s.sourceType,
			bindType: s.bindType,
			period: s.period,
			counterparties: s.counterparties
		}))
	);
	const distributorsInput = useFiltersStore(
		useShallow((s) => ({
			year: s.year,
			sourceType: s.sourceType,
			bindType: s.bindType,
			period: s.period,
			brands: s.brands
		}))
	);

	return useQuery({
		queryKey: isDistributors
			? primarySalesKeys.distributorsByBrandData(distributorsInput)
			: primarySalesKeys.topBrandsData(brandsInput),
		queryFn: () =>
			isDistributors ? fetchDistributorsByBrandData(distributorsInput) : fetchBrandsData(brandsInput),
		placeholderData: keepPreviousData
	});
}

export function useDriversChartView(view: DriversView): { data: DriverRow[] | undefined; isStale: boolean } {
	const metric = useFiltersStore((s) => s.metric);
	const { data, isPlaceholderData } = useDriversData(view);
	if (!data) return { data: undefined, isStale: false };
	return {
		data: aggregate(data, pickMeasureField(metric)),
		isStale: isPlaceholderData
	};
}
