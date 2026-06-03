import {
	createMdtApiClient,
	type TabularColumnRef,
	type TabularFilter,
	type TabularRawRow,
	type TabularRequest
} from "../../../shared/api";
import type { FiltersState, Period } from "../stores/useFiltersStore";
import {
	buildTableFilter,
	generatePeriodIds,
	getValueColumn,
	getValueField,
	GROUP_FIELD,
	MEASURE_FIELD,
	YEAR_FIELD
} from "./tabular";

const API_URL = "https://modules-dev.ics-it.ru/typification/api/v2";
const mdtApi = createMdtApiClient(API_URL);

export type FilterOption = { value: string; label: string };

export async function fetchDistributors(search: string): Promise<FilterOption[]> {
	const query: any = {
		table: "Client~Tabular",
		orderBy: [{ path: "Client", orderType: "asc" }],
		distinct: true,
		select: [{ path: "Client" }],
		take: 1000000
	};

	if (search) {
		query.filter = {
			op: "contains",
			path: "Client",
			value: search.trim().toLowerCase()
		};
	}

	const data = await mdtApi.rawFetch<{ payload: { rows: any[] } }>(query);

	return data.payload.rows.map((item: any) => ({
		value: item.Client,
		label: item.Client
	}));
}

export async function fetchBrands(search: string): Promise<FilterOption[]> {
	const query: any = {
		table: "Product~Tabular",
		orderBy: [{ path: "Product Brand", orderType: "asc" }],
		distinct: true,
		select: [{ path: "Product Brand" }],
		take: 1000000
	};

	if (search) {
		query.filter = {
			op: "contains",
			path: "Product Brand",
			value: search.trim().toLowerCase()
		};
	}

	const data = await mdtApi.rawFetch<{ payload: { rows: any[] } }>(query);

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
			{ column: { table: "Secondary Sales~Tabular", name: "Secondary Sales, unit" } },
			{ column: { table: "Secondary Sales~Tabular", name: "Secondary Sales, USD conversion" } },
			{ column: { table: "Secondary Sales~Tabular", name: "Secondary Sales, INV RUB" } },
			{ column: { table: "Calendar~Tabular", name: "Year" } }
		],
		take: 1000000,
		skip: 0,
		filter: { op: "and", groups: main }
	};
}

export async function fetchCards(input: CardsFetcherInput): Promise<CardsRaw> {
	const body = buildCardsRequest(input);
	const data = await mdtApi.tabularFetch(body);

	const rows = data.payload.rows.map((r) => ({
		year: Number(r[YEAR_FIELD]),
		units: Number(r[MEASURE_FIELD.unit] ?? 0),
		valueUsd: Number(r[MEASURE_FIELD.usd] ?? 0),
		valueRub: Number(r[MEASURE_FIELD.rub] ?? 0)
	}));

	return { year: input.year, rows };
}

export type DistributorsRaw = {
	year: number;
	rows: Array<{ name: string; year: number; units: number; valueUsd: number; valueRub: number }>;
};

type DistributorsFetcherInput = Pick<FiltersState, "year" | "sourceType" | "bindType" | "period">;

function buildDistributorsRequest(input: DistributorsFetcherInput): TabularRequest {
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
			{ column: { table: "Secondary Sales~Tabular", name: "Secondary Sales, unit" } },
			{ column: { table: "Secondary Sales~Tabular", name: "Secondary Sales, USD conversion" } },
			{ column: { table: "Secondary Sales~Tabular", name: "Secondary Sales, INV RUB" } },
			{ column: { table: "Client~Tabular", name: "Client" } },
			{ column: { table: "Calendar~Tabular", name: "Year" } }
		],
		take: 1000000,
		skip: 0,
		filter: { op: "and", groups: main }
	};
}

export async function fetchDistributorsData(input: DistributorsFetcherInput): Promise<DistributorsRaw> {
	const body = buildDistributorsRequest(input);
	const data = await mdtApi.tabularFetch(body);

	const rows = data.payload.rows.map((r) => ({
		name: String(r[GROUP_FIELD.counterparty] ?? ""),
		year: Number(r[YEAR_FIELD]),
		units: Number(r[MEASURE_FIELD.unit] ?? 0),
		valueUsd: Number(r[MEASURE_FIELD.usd] ?? 0),
		valueRub: Number(r[MEASURE_FIELD.rub] ?? 0)
	}));

	return { year: input.year, rows };
}

export type RegionsRaw = {
	year: number;
	rows: Array<{ name: string; year: number; units: number; valueUsd: number; valueRub: number }>;
};

type RegionsFetcherInput = Pick<
	FiltersState,
	"year" | "sourceType" | "bindType" | "period" | "counterparties" | "brands"
>;

const REGION_COL: TabularColumnRef = {
	column: { table: "Client Location~Tabular", name: "Client Location Region FIAS" }
};

function buildRegionsRequest(input: RegionsFetcherInput): TabularRequest {
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
	if (input.counterparties.length > 0) {
		main.push({
			op: "in",
			column: { table: "Client~Tabular", name: "Client" },
			list: input.counterparties.map((c) => c.value)
		});
	}
	if (input.brands.length > 0) {
		main.push({
			op: "in",
			column: { table: "Product~Tabular", name: "Product Brand" },
			list: input.brands.map((b) => b.value)
		});
	}

	return {
		select: [
			{ column: { table: "Secondary Sales~Tabular", name: "Secondary Sales, unit" } },
			{ column: { table: "Secondary Sales~Tabular", name: "Secondary Sales, USD conversion" } },
			{ column: { table: "Secondary Sales~Tabular", name: "Secondary Sales, INV RUB" } },
			REGION_COL,
			{ column: { table: "Calendar~Tabular", name: "Year" } }
		],
		take: 1000000,
		skip: 0,
		filter: { op: "and", groups: main }
	};
}

export async function fetchRegionsData(input: RegionsFetcherInput): Promise<RegionsRaw> {
	const body = buildRegionsRequest(input);
	const data = await mdtApi.tabularFetch(body);

	const rows = data.payload.rows.map((r) => ({
		name: String(r[GROUP_FIELD.region] ?? ""),
		year: Number(r[YEAR_FIELD]),
		units: Number(r[MEASURE_FIELD.unit] ?? 0),
		valueUsd: Number(r[MEASURE_FIELD.usd] ?? 0),
		valueRub: Number(r[MEASURE_FIELD.rub] ?? 0)
	}));

	return { year: input.year, rows };
}

export type BrandsRaw = {
	year: number;
	rows: Array<{ name: string; year: number; units: number; valueUsd: number; valueRub: number }>;
};

type BrandsFetcherInput = Pick<FiltersState, "year" | "sourceType" | "bindType" | "period" | "counterparties">;

const BRAND_COL: TabularColumnRef = {
	column: { table: "Product~Tabular", name: "Product Brand" }
};

function buildBrandsRequest(input: BrandsFetcherInput): TabularRequest {
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

	if (input.counterparties.length > 0) {
		main.push({
			op: "in",
			column: { table: "Client~Tabular", name: "Client" },
			list: input.counterparties.map((c) => c.value)
		});
	}

	const ranges = generatePeriodRanges(input.year, input.period);
	if (ranges) {
		main.push(buildPeriodIdsFilter(ranges));
	}

	return {
		select: [
			{ column: { table: "Secondary Sales~Tabular", name: "Secondary Sales, unit" } },
			{ column: { table: "Secondary Sales~Tabular", name: "Secondary Sales, USD conversion" } },
			{ column: { table: "Secondary Sales~Tabular", name: "Secondary Sales, INV RUB" } },
			BRAND_COL,
			{ column: { table: "Calendar~Tabular", name: "Year" } }
		],
		take: 1000000,
		skip: 0,
		filter: { op: "and", groups: main }
	};
}

export async function fetchBrandsData(input: BrandsFetcherInput): Promise<BrandsRaw> {
	const body = buildBrandsRequest(input);
	const data = await mdtApi.tabularFetch(body);

	const rows = data.payload.rows.map((r) => ({
		name: String(r[GROUP_FIELD.brand] ?? ""),
		year: Number(r[YEAR_FIELD]),
		units: Number(r[MEASURE_FIELD.unit] ?? 0),
		valueUsd: Number(r[MEASURE_FIELD.usd] ?? 0),
		valueRub: Number(r[MEASURE_FIELD.rub] ?? 0)
	}));

	return { year: input.year, rows };
}

type TrendFetcherInput = Pick<
	FiltersState,
	"year" | "sourceType" | "bindType" | "period" | "counterparties" | "brands"
>;

const MONTH_COL: TabularColumnRef = {
	column: { table: "Calendar~Tabular", name: "Month" }
};
const MONTH_RESP_FIELD = "Calendar[Month]" as const;

function buildTrendDataRequest(input: TrendFetcherInput): TabularRequest {
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

	if (input.counterparties.length > 0) {
		main.push({
			op: "in",
			column: { table: "Client~Tabular", name: "Client" },
			list: input.counterparties.map((c) => c.value)
		});
	}
	if (input.brands.length > 0) {
		main.push({
			op: "in",
			column: { table: "Product~Tabular", name: "Product Brand" },
			list: input.brands.map((b) => b.value)
		});
	}

	const ranges = generatePeriodRanges(input.year, input.period);
	if (ranges) {
		main.push(buildPeriodIdsFilter(ranges));
	}

	return {
		select: [
			{ column: { table: "Secondary Sales~Tabular", name: "Secondary Sales, unit" } },
			{ column: { table: "Secondary Sales~Tabular", name: "Secondary Sales, USD conversion" } },
			{ column: { table: "Secondary Sales~Tabular", name: "Secondary Sales, INV RUB" } },
			MONTH_COL,
			{ column: { table: "Calendar~Tabular", name: "Year" } }
		],
		take: 1000000,
		skip: 0,
		filter: { op: "and", groups: main }
	};
}

export type TrendDataRaw = {
	year: number;
	rows: Array<{ month: string; year: number; units: number; valueUsd: number; valueRub: number }>;
};

export async function fetchTrendData(input: TrendFetcherInput): Promise<TrendDataRaw> {
	const body = buildTrendDataRequest(input);
	const data = await mdtApi.tabularFetch(body);

	const rows = data.payload.rows.map((r) => ({
		month: String(r[MONTH_RESP_FIELD] ?? ""),
		year: Number(r[YEAR_FIELD]),
		units: Number(r[MEASURE_FIELD.unit] ?? 0),
		valueUsd: Number(r[MEASURE_FIELD.usd] ?? 0),
		valueRub: Number(r[MEASURE_FIELD.rub] ?? 0)
	}));

	return { year: input.year, rows };
}

type DistributorsByBrandInput = Pick<FiltersState, "year" | "sourceType" | "bindType" | "period" | "brands">;

function buildDistributorsByBrandRequest(input: DistributorsByBrandInput): TabularRequest {
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

	if (input.brands.length > 0) {
		main.push({
			op: "in",
			column: { table: "Product~Tabular", name: "Product Brand" },
			list: input.brands.map((b) => b.value)
		});
	}

	const ranges = generatePeriodRanges(input.year, input.period);
	if (ranges) {
		main.push(buildPeriodIdsFilter(ranges));
	}

	return {
		select: [
			{ column: { table: "Secondary Sales~Tabular", name: "Secondary Sales, unit" } },
			{ column: { table: "Secondary Sales~Tabular", name: "Secondary Sales, USD conversion" } },
			{ column: { table: "Secondary Sales~Tabular", name: "Secondary Sales, INV RUB" } },
			{ column: { table: "Client~Tabular", name: "Client" } },
			{ column: { table: "Calendar~Tabular", name: "Year" } }
		],
		take: 1000000,
		skip: 0,
		filter: { op: "and", groups: main }
	};
}

export async function fetchDistributorsByBrandData(input: DistributorsByBrandInput): Promise<DistributorsRaw> {
	const body = buildDistributorsByBrandRequest(input);
	const data = await mdtApi.tabularFetch(body);

	const rows = data.payload.rows.map((r) => ({
		name: String(r[GROUP_FIELD.counterparty] ?? ""),
		year: Number(r[YEAR_FIELD]),
		units: Number(r[MEASURE_FIELD.unit] ?? 0),
		valueUsd: Number(r[MEASURE_FIELD.usd] ?? 0),
		valueRub: Number(r[MEASURE_FIELD.rub] ?? 0)
	}));

	return { year: input.year, rows };
}

type RegionsByBrandInput = Pick<
	FiltersState,
	"year" | "sourceType" | "bindType" | "period" | "counterparties" | "brands"
>;

function buildRegionsByBrandRequest(input: RegionsByBrandInput): TabularRequest {
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

	if (input.brands.length > 0) {
		main.push({
			op: "in",
			column: { table: "Product~Tabular", name: "Product Brand" },
			list: input.brands.map((b) => b.value)
		});
	}
	if (input.counterparties.length > 0) {
		main.push({
			op: "in",
			column: { table: "Client~Tabular", name: "Client" },
			list: input.counterparties.map((c) => c.value)
		});
	}

	const ranges = generatePeriodRanges(input.year, input.period);
	if (ranges) {
		main.push(buildPeriodIdsFilter(ranges));
	}

	return {
		select: [
			{ column: { table: "Secondary Sales~Tabular", name: "Secondary Sales, unit" } },
			{ column: { table: "Secondary Sales~Tabular", name: "Secondary Sales, USD conversion" } },
			{ column: { table: "Secondary Sales~Tabular", name: "Secondary Sales, INV RUB" } },
			REGION_COL,
			{ column: { table: "Calendar~Tabular", name: "Year" } }
		],
		take: 1000000,
		skip: 0,
		filter: { op: "and", groups: main }
	};
}

export async function fetchRegionsByBrandData(input: RegionsByBrandInput): Promise<RegionsRaw> {
	const body = buildRegionsByBrandRequest(input);
	const data = await mdtApi.tabularFetch(body);

	const rows = data.payload.rows.map((r) => ({
		name: String(r[GROUP_FIELD.region] ?? ""),
		year: Number(r[YEAR_FIELD]),
		units: Number(r[MEASURE_FIELD.unit] ?? 0),
		valueUsd: Number(r[MEASURE_FIELD.usd] ?? 0),
		valueRub: Number(r[MEASURE_FIELD.rub] ?? 0)
	}));

	return { year: input.year, rows };
}
