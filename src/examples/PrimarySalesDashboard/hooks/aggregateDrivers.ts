import type { GroupedRaw } from "../api/fetchers";
import { YEAR_FIELD } from "../api/tabular";

export type DriverRow = { name: string; diff: number };

export function aggregateDrivers(raw: GroupedRaw): DriverRow[] {
	const current = raw.year;
	const previous = raw.year - 1;
	const byName: Record<string, { cur: number; prev: number }> = {};

	for (const row of raw.rows) {
		const name = row[raw.groupField] as string;
		const year = row[YEAR_FIELD] as number;
		const value = row[raw.valueField] as number;
		if (!byName[name]) byName[name] = { cur: 0, prev: 0 };
		if (year === current) byName[name].cur = value;
		else if (year === previous) byName[name].prev = value;
	}

	const rows = Object.entries(byName)
		.map(([name, v]) => ({ name, diff: Math.round(v.cur - v.prev) }))
		.filter((r) => r.diff !== 0)
		.sort((a, b) => b.diff - a.diff);

	const top = rows.slice(0, 5);
	const bottom = rows.slice(-5).filter((r) => !top.includes(r));
	return [...top, ...bottom];
}
