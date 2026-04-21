import type { Currency, Metric, Period } from "../stores/useFiltersStore";

export type TabularColumnRef = { column: { table: string; name: string } };

export type TabularFilter =
	| { op: "and" | "or"; groups: TabularFilter[] }
	| { op: "eq"; column: { table: string; name: string }; value: string | number }
	| { op: "in"; column: { table: string; name: string }; list: Array<string | number> }
	| { op: "contains"; column: { table: string; name: string }; value: string }
	| { op: "le" | "ge" | "lt" | "gt"; column: { table: string; name: string }; value: number | string };

export type PeriodRange = { startId: number; endId: number };

export type TabularRequest = {
	select: TabularColumnRef[];
	filter: TabularFilter;
	take: number;
	skip: number;
};

export type TabularRawRow = Record<string, string | number>;
export type TabularResponse = { payload: { rows: TabularRawRow[] } };

export const MEASURE_FIELD = {
	unit: "[Primary Sales, unit]",
	rub: "[Primary Sales, INV RUB]",
	usd: "[Primary Sales, USD conversion]"
} as const;

export const GROUP_FIELD = {
	counterparty: "Counterparty[Counterparty]",
	brand: "Product[Product Brand]"
} as const;

export const YEAR_FIELD = "Calendar[Year]" as const;

export function getValueColumn(metric: Metric, currency: Currency): TabularColumnRef {
	if (metric === "Units") {
		return { column: { table: "Primary Sales~Tabular", name: "Primary Sales, unit" } };
	}
	if (currency === "USD") {
		return { column: { table: "Primary Sales~Tabular", name: "Primary Sales, USD conversion" } };
	}
	return { column: { table: "Primary Sales~Tabular", name: "Primary Sales, INV RUB" } };
}

export function getValueField(metric: Metric, currency: Currency): string {
	if (metric === "Units") return MEASURE_FIELD.unit;
	return currency === "USD" ? MEASURE_FIELD.usd : MEASURE_FIELD.rub;
}

export function generatePeriodIds(year: number, period: Period): number[] | null {
	if (period === "FY") return null;

	const today = new Date();
	const currentMonth = today.getMonth();
	const currentDay = today.getDate();

	let startMonth: number;
	switch (period) {
		case "QTD":
			startMonth = Math.floor(currentMonth / 3) * 3;
			break;
		case "MTD":
			startMonth = currentMonth;
			break;
		default:
			startMonth = 0;
	}

	const ids: number[] = [];
	for (const y of [year, year - 1]) {
		const start = new Date(y, startMonth, 1);
		const end = new Date(y, currentMonth, currentDay);
		for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
			const m = String(d.getMonth() + 1).padStart(2, "0");
			const day = String(d.getDate()).padStart(2, "0");
			ids.push(Number(`${d.getFullYear()}${m}${day}`));
		}
	}
	return ids;
}

type BuildFilterInput = {
	year: number;
	sourceType: string;
	bindType: string;
	brandValues?: string[];
	counterpartyValues?: string[];
	periodIds: number[] | null;
};

export function buildTableFilter(input: BuildFilterInput): TabularFilter {
	const main: TabularFilter[] = [
		{
			op: "in",
			column: { table: "Calendar~Tabular", name: "Year" },
			list: [input.year - 1, input.year]
		},
		{
			op: "eq",
			column: { table: "Source Type~Tabular", name: "Source Type" },
			value: input.sourceType
		},
		{
			op: "eq",
			column: { table: "Bind Type~Tabular", name: "Bind Type" },
			value: input.bindType
		}
	];

	if (input.brandValues && input.brandValues.length > 0) {
		main.push({
			op: "in",
			column: { table: "Product~Tabular", name: "Product Brand" },
			list: input.brandValues
		});
	}
	if (input.counterpartyValues && input.counterpartyValues.length > 0) {
		main.push({
			op: "in",
			column: { table: "Counterparty~Tabular", name: "Counterparty" },
			list: input.counterpartyValues
		});
	}

	const mainGroup: TabularFilter = { op: "and", groups: main };

	if (!input.periodIds) return mainGroup;

	return {
		op: "and",
		groups: [
			mainGroup,
			{
				op: "in",
				column: { table: "Calendar~Tabular", name: "ID" },
				list: input.periodIds
			}
		]
	};
}

export async function tabularFetch(_request: TabularRequest): Promise<TabularResponse> {
	throw new Error("tabularFetch: real endpoint not wired yet");
}
