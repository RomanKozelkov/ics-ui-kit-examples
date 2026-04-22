export type RankingRow = {
	sortOrder: number;
	name: string;
	sales: number;
	yoy: number | null;
	share: number;
	rank: number | null;
};

export type MeasureField = "units" | "valueUsd" | "valueRub";

export function pickMeasureField(metric: string, currency: string): MeasureField {
	if (metric === "Units") return "units";
	return currency === "USD" ? "valueUsd" : "valueRub";
}

type InputRow = { name: string; year: number; units: number; valueUsd: number; valueRub: number };

export function aggregateRanking(
	rows: InputRow[],
	currentYear: number,
	field: MeasureField
): RankingRow[] {
	const previousYear = currentYear - 1;
	const byName: Record<string, { current: number | null; previous: number | null }> = {};

	for (const row of rows) {
		if (!row.name) continue;
		if (!byName[row.name]) byName[row.name] = { current: null, previous: null };
		const v = row[field];
		if (row.year === currentYear) byName[row.name].current = (byName[row.name].current ?? 0) + v;
		else if (row.year === previousYear) byName[row.name].previous = (byName[row.name].previous ?? 0) + v;
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
