import type { GroupedRaw } from "../api/fetchers";
import { YEAR_FIELD } from "../api/tabular";

export type GroupedRow = {
	sortOrder: number;
	name: string;
	sales: number;
	yoy: number | null;
	share: number;
	rank: number | null;
};

export function aggregateGrouped(raw: GroupedRaw): GroupedRow[] {
	const current = raw.year;
	const previous = raw.year - 1;
	const byName: Record<string, { current: number | null; previous: number | null }> = {};

	for (const row of raw.rows) {
		const name = row[raw.groupField] as string;
		const year = row[YEAR_FIELD] as number;
		const value = row[raw.valueField] as number;
		if (!byName[name]) byName[name] = { current: null, previous: null };
		if (year === current) byName[name].current = value;
		else if (year === previous) byName[name].previous = value;
	}

	const totalCurrent = Object.values(byName).reduce((sum, v) => sum + (v.current ?? 0), 0);

	const curSorted = Object.entries(byName)
		.map(([name, data]) => ({
			name,
			sales: Math.round(data.current ?? 0),
			prevSales: Math.round(data.previous ?? 0)
		}))
		.sort((a, b) => b.sales - a.sales);

	const prevRankMap: Record<string, number> = {};
	Object.entries(byName)
		.map(([name, data]) => ({ name, prev: data.previous ?? 0 }))
		.sort((a, b) => b.prev - a.prev)
		.forEach((r, i) => {
			prevRankMap[r.name] = i + 1;
		});

	return curSorted.map((row, i) => {
		const sortOrder = i + 1;
		const yoy = row.prevSales ? Math.round(((row.sales - row.prevSales) / row.prevSales) * 100) : null;
		const share = totalCurrent ? Math.round((row.sales / totalCurrent) * 100) : 0;
		const prevRank = prevRankMap[row.name];
		const rank = prevRank != null ? prevRank - sortOrder : null;
		return { sortOrder, name: row.name, sales: row.sales, yoy, share, rank };
	});
}
