import type { FiltersState, Period } from "../stores/useFiltersStore";
import {
	buildTableFilter,
	generatePeriodIds,
	generatePeriodRanges,
	getValueColumn,
	getValueField,
	GROUP_FIELD,
	MEASURE_FIELD,
	YEAR_FIELD,
	type TabularColumnRef,
	type TabularFilter,
	type TabularRawRow,
	type TabularRequest,
	type TabularResponse
} from "./tabular";

// #region === AI Generated Code ===

export type CardsRaw = {
	year: number;
	rows: Array<{ year: number; valueRub: number; valueUsd: number; units: number }>;
};

const seed = (s: string) => {
	let h = 2166136261;
	for (let i = 0; i < s.length; i++) {
		h ^= s.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return (h >>> 0) / 2 ** 32;
};

const DISTRIBUTOR_POOL = [
	"Пульс ФК ООО",
	"Гранд Капитал ООО",
	"Фармкомплект ООО",
	"БСС ООО",
	"Вита Лайн ООО",
	"Катрен НПК ЗАО",
	"Протек Центр внедрения ЗАО",
	"Магнит Фарма ООО",
	"Фармперспектива ООО",
	"Агроресурсы ООО"
];

const BRAND_POOL = [
	"Zolphirex Night",
	"Osteoglyph",
	"Thyquolam",
	"Rhevixol Joint",
	"Ferruvoxin Hema",
	"Panzyqor Enzyme",
	"Yttrivax",
	"Dwimoxan",
	"Phleboquin Vaso",
	"Pyrovexan",
	"Pharynquex Throat",
	"Zynqora",
	"Cephaloquix",
	"Xephador Rapid",
	"Aetherix"
];

type GroupedInput = Pick<
	FiltersState,
	"year" | "metric" | "currency" | "sourceType" | "bindType" | "period" | "counterparties" | "brands"
>;

function buildGroupedRequest(input: GroupedInput, groupBy: "counterparty" | "brand"): TabularRequest {
	const valueCol = getValueColumn(input.metric, input.currency);
	const groupCol =
		groupBy === "counterparty"
			? { column: { table: "Counterparty~Tabular", name: "Counterparty" } }
			: { column: { table: "Product~Tabular", name: "Product Brand" } };

	const periodIds = generatePeriodIds(input.year, input.period);

	const filter = buildTableFilter({
		year: input.year,
		sourceType: input.sourceType,
		bindType: input.bindType,
		brandValues: groupBy === "counterparty" ? input.brands.map((b) => b.value) : undefined,
		counterpartyValues: groupBy === "brand" ? input.counterparties.map((c) => c.value) : undefined,
		periodIds
	});

	return {
		select: [valueCol, groupCol, { column: { table: "Calendar~Tabular", name: "Year" } }],
		take: 10000,
		skip: 0,
		filter
	};
}

function mockGroupedResponse(input: GroupedInput, groupBy: "counterparty" | "brand"): TabularRawRow[] {
	const pool = groupBy === "counterparty" ? DISTRIBUTOR_POOL : BRAND_POOL;
	const groupKey = GROUP_FIELD[groupBy];
	const valueField = getValueField(input.metric, input.currency);

	const pick = groupBy === "counterparty" ? input.brands : input.counterparties;
	const pickTag = pick
		.map((p) => p.value)
		.sort()
		.join("|");
	const scale = input.metric === "Units" ? 1 : input.currency === "USD" ? 100 : 10_000;

	const rows: TabularRawRow[] = [];
	for (const name of pool) {
		for (const y of [input.year, input.year - 1]) {
			const k = `${name}|${y}|${input.period}|${input.sourceType}|${input.bindType}|${pickTag}|${input.metric}|${input.currency}`;
			const r = seed(k);
			if (r < 0.15) continue;
			const base = Math.floor((500 + r * 50_000) * scale);
			rows.push({ [groupKey]: name, [YEAR_FIELD]: y, [valueField]: base });
		}
	}
	return rows;
}

export type GroupedRaw = {
	rows: TabularRawRow[];
	year: number;
	valueField: string;
	groupField: string;
};

async function fetchGrouped(input: GroupedInput, groupBy: "counterparty" | "brand"): Promise<GroupedRaw> {
	buildGroupedRequest(input, groupBy);
	await new Promise((r) => setTimeout(r, 300));
	return {
		rows: mockGroupedResponse(input, groupBy),
		year: input.year,
		valueField: getValueField(input.metric, input.currency),
		groupField: GROUP_FIELD[groupBy]
	};
}

export const fetchDistributorsTable = (input: GroupedInput) => fetchGrouped(input, "counterparty");
export const fetchBrandsTable = (input: GroupedInput) => fetchGrouped(input, "brand");

const MONTH_FIELD = "Calendar[Month]" as const;
const MONTHS_ORDER = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export type TrendRaw = {
	rows: TabularRawRow[];
	year: number;
	valueField: string;
};

function buildTrendRequest(input: GroupedInput): TabularRequest {
	const valueCol = getValueColumn(input.metric, input.currency);
	const periodIds = generatePeriodIds(input.year, input.period);

	const filter = buildTableFilter({
		year: input.year,
		sourceType: input.sourceType,
		bindType: input.bindType,
		brandValues: input.brands.map((b) => b.value),
		counterpartyValues: input.counterparties.map((c) => c.value),
		periodIds
	});

	return {
		select: [
			valueCol,
			{ column: { table: "Calendar~Tabular", name: "Month" } },
			{ column: { table: "Calendar~Tabular", name: "Year" } }
		],
		take: 1000,
		skip: 0,
		filter
	};
}

function mockTrendResponse(input: GroupedInput): TabularRawRow[] {
	const valueField = getValueField(input.metric, input.currency);
	const pickTag = [...input.brands.map((b) => b.value), ...input.counterparties.map((c) => c.value)].sort().join("|");
	const scale = input.metric === "Units" ? 1 : input.currency === "USD" ? 100 : 10_000;

	const rows: TabularRawRow[] = [];
	for (const y of [input.year, input.year - 1]) {
		for (const month of MONTHS_ORDER) {
			const k = `${month}|${y}|${input.period}|${input.sourceType}|${input.bindType}|${pickTag}|${input.metric}|${input.currency}`;
			const r = seed(k);
			const base = Math.floor((5_000 + r * 50_000) * scale);
			rows.push({
				[MONTH_FIELD]: month,
				[YEAR_FIELD]: y,
				[valueField]: base
			});
		}
	}
	return rows;
}

export async function fetchTrend(input: GroupedInput): Promise<TrendRaw> {
	buildTrendRequest(input);
	await new Promise((r) => setTimeout(r, 300));
	return {
		rows: mockTrendResponse(input),
		year: input.year,
		valueField: getValueField(input.metric, input.currency)
	};
}

export type FilterOption = { value: string; label: string };

function buildOptionsRequest(groupBy: "counterparty" | "brand", search: string): TabularRequest {
	const groupCol: TabularColumnRef =
		groupBy === "counterparty"
			? { column: { table: "Counterparty~Tabular", name: "Counterparty" } }
			: { column: { table: "Product~Tabular", name: "Product Brand" } };

	const filter: TabularFilter = search
		? { op: "contains", column: groupCol.column, value: search }
		: { op: "and", groups: [] };

	return { select: [groupCol], take: 50, skip: 0, filter };
}

export async function fetchBrandOptions(search: string): Promise<FilterOption[]> {
	buildOptionsRequest("brand", search);
	await new Promise((r) => setTimeout(r, 150));
	const q = search.trim().toLowerCase();
	return BRAND_POOL.filter((name) => (q ? name.toLowerCase().includes(q) : true)).map((name) => ({
		value: name,
		label: name
	}));
}

// #endregion

// === READY FOR USE ===

const API_URL = "https://modules-dev.ics-it.ru/typification/api/v2";

export async function fetchDistributors(search: string): Promise<FilterOption[]> {
	const query: any = {
		table: "md.DirectCompany",
		orderBy: [{ path: "ID_Company/vw_Company_AdditionalInfo_o2o/Name", orderType: "asc" }]
	};

	if (search) {
		query.filter = {
			op: "contains",
			path: "ID_Company/vw_Company_AdditionalInfo_o2o/Name",
			value: search.trim().toLowerCase()
		};
	}

	const res = await fetch(`${API_URL}/fetch`, {
		method: "POST",
		body: JSON.stringify(query),
		credentials: "include",
		headers: { "Content-Type": "application/json" }
	});
	if (!res.ok) throw new Error(`API error: ${res.status}`);

	const data = await res.json();

	return data.payload.rows.map((item: any) => ({
		value: item.ID_Company$.vw_Company_AdditionalInfo_o2o$.Name,
		label: item.ID_Company$.vw_Company_AdditionalInfo_o2o$.Name
	}));
}

export async function fetchBrands(search: string): Promise<FilterOption[]> {
	const query: any = {
		table: "Product~Tabular",
		orderBy: [{ path: "Product Brand", orderType: "asc" }],
		distinct: true,
		select: [{ path: "Product Brand" }],
		take: 10000
	};

	if (search) {
		query.filter = {
			op: "contains",
			path: "Product Brand",
			value: search.trim().toLowerCase()
		};
	}

	const res = await fetch(`${API_URL}/fetch`, {
		method: "POST",
		body: JSON.stringify(query),
		credentials: "include",
		headers: { "Content-Type": "application/json" }
	});
	if (!res.ok) throw new Error(`API error: ${res.status}`);

	const data = await res.json();

	return data.payload.rows.map((item: any) => ({
		value: item["Product Brand"],
		label: item["Product Brand"]
	}));
}

type CardsFetcherInput = Pick<FiltersState, "year" | "sourceType" | "bindType" | "period">;

const CALENDAR_ID = { table: "Calendar~Tabular", name: "ID" } as const;

export type PeriodRange = { startId: number; endId: number };

function yyyymmdd(d: Date): number {
	const m = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	return Number(`${d.getFullYear()}${m}${day}`);
}

export function generatePeriodRanges(year: number, period: Period): PeriodRange[] | null {
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

	const ranges: PeriodRange[] = [];
	for (const y of [year, year - 1]) {
		const start = new Date(y, startMonth, 1);
		const end = new Date(y, currentMonth, currentDay);
		ranges.push({ startId: yyyymmdd(start), endId: yyyymmdd(end) });
	}
	return ranges;
}

// Как должно быть: диапазонный фильтр через or(and(ge, le)).
// Бэкенд такой формат не принимает — оставлено для справки.
export function buildPeriodFilter(ranges: PeriodRange[]): TabularFilter {
	return {
		op: "or",
		groups: ranges.map((r) => ({
			op: "and" as const,
			groups: [
				{ op: "ge" as const, column: { ...CALENDAR_ID }, value: r.startId },
				{ op: "le" as const, column: { ...CALENDAR_ID }, value: r.endId }
			]
		}))
	};
}

function expandRangeToIds(range: PeriodRange): number[] {
	const startY = Math.floor(range.startId / 10000);
	const startM = Math.floor((range.startId % 10000) / 100) - 1;
	const startD = range.startId % 100;
	const endY = Math.floor(range.endId / 10000);
	const endM = Math.floor((range.endId % 10000) / 100) - 1;
	const endD = range.endId % 100;

	const ids: number[] = [];
	const cursor = new Date(startY, startM, startD);
	const end = new Date(endY, endM, endD);
	while (cursor <= end) {
		ids.push(yyyymmdd(cursor));
		cursor.setDate(cursor.getDate() + 1);
	}
	return ids;
}

export function buildPeriodIdsFilter(ranges: PeriodRange[]): TabularFilter {
	const list = ranges.flatMap(expandRangeToIds);
	return {
		op: "in",
		column: { ...CALENDAR_ID },
		list
	};
}

function buildCardsRequest(input: CardsFetcherInput): TabularRequest {
	const main: TabularFilter[] = [
		{
			op: "eq",
			column: { table: "Source Type~Tabular", name: "Source Type" },
			value: input.sourceType
		},
		{
			op: "eq",
			column: { table: "Bind Type~Tabular", name: "Bind Type" },
			value: input.bindType
		},
		{
			op: "in",
			column: { table: "Calendar~Tabular", name: "Year" },
			list: [input.year - 1, input.year]
		}
	];

	const ranges = generatePeriodRanges(input.year, input.period);
	if (ranges) {
		main.push(buildPeriodIdsFilter(ranges));
	}

	return {
		select: [
			{ column: { table: "Primary Sales~Tabular", name: "Primary Sales, unit" } },
			{ column: { table: "Primary Sales~Tabular", name: "Primary Sales, USD conversion" } },
			{ column: { table: "Primary Sales~Tabular", name: "Primary Sales, INV RUB" } },
			{ column: { table: "Calendar~Tabular", name: "Year" } }
		],
		take: 1000,
		skip: 0,
		filter: { op: "and", groups: main }
	};
}

export async function fetchCards(input: CardsFetcherInput): Promise<CardsRaw> {
	const body = buildCardsRequest(input);
	const res = await fetch(`${API_URL}/tabular/fetch`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify(body)
	});
	if (!res.ok) throw new Error(`API error: ${res.status}`);
	const data = (await res.json()) as TabularResponse;

	const rows = data.payload.rows.map((r) => ({
		year: Number(r[YEAR_FIELD]),
		units: Number(r[MEASURE_FIELD.unit] ?? 0),
		valueUsd: Number(r[MEASURE_FIELD.usd] ?? 0),
		valueRub: Number(r[MEASURE_FIELD.rub] ?? 0)
	}));

	return { year: input.year, rows };
}
