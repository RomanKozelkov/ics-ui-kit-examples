import {
	createMdtApiClient,
	type TabularColumnRef,
	type TabularFilter,
	type TabularRawRow,
	type TabularRequest
} from "../../../shared/api";
import { inFilter } from "../../../shared/bi-dashboard/api/filters";
import { buildPeriodFilter } from "../../../shared/bi-dashboard/api/period";
import { column, keyOf, read, SCHEMA } from "../../../shared/bi-dashboard/api/schema";
import type { BaseScope, BrandScope, CounterpartyBrandScope, CounterpartyScope } from "./scopes";

const API_URL = "https://modules-dev.ics-it.ru/typification/api/v2";
const mdtApi = createMdtApiClient(API_URL);

/** Ключи ответа для парсинга строк tabular (мера/группировка/год). */
const MEASURE_FIELD = {
	unit: keyOf(SCHEMA.primarySales.fields.unit),
	usd: keyOf(SCHEMA.primarySales.fields.usd),
	rub: keyOf(SCHEMA.primarySales.fields.rub)
} as const;
const GROUP_FIELD = {
	counterparty: keyOf(SCHEMA.client.fields.client),
	brand: keyOf(SCHEMA.product.fields.brand)
} as const;
const YEAR_FIELD = keyOf(SCHEMA.calendar.fields.year);

export type FilterOption = { value: string; label: string };

/** Колонки меры (unit/usd/rub) дашборда для tabular `select`. */
const MEASURE_COLS: TabularColumnRef[] = [
	column(SCHEMA.primarySales, "unit"),
	column(SCHEMA.primarySales, "usd"),
	column(SCHEMA.primarySales, "rub")
];
const YEAR_COL = column(SCHEMA.calendar, "year");

/** Базовые фильтры запроса данных: источник, тип привязки, два года, период. */
function baseFilters(input: BaseScope): TabularFilter[] {
	const main: TabularFilter[] = [
		{ op: "eq", column: column(SCHEMA.sourceType, "sourceType").column, value: input.sourceType },
		{ op: "eq", column: column(SCHEMA.bindType, "bindType").column, value: input.bindType },
		{ op: "in", column: YEAR_COL.column, list: [input.year - 1, input.year] }
	];
	const periodFilter = buildPeriodFilter(input.year, input.period);
	if (periodFilter) main.push(periodFilter);
	return main;
}

export async function fetchDistributors(search: string): Promise<FilterOption[]> {
	const field = SCHEMA.directCompany.fields.name;
	const query: any = {
		table: SCHEMA.directCompany.table,
		orderBy: [{ path: field.name, orderType: "asc" }]
	};

	if (search) {
		query.filter = { op: "contains", path: field.name, value: search.trim().toLowerCase() };
	}

	const data = await mdtApi.rawFetch<{ payload: { rows: TabularRawRow[] } }>(query);

	return data.payload.rows.map((item) => {
		const value = String(read(field, item) ?? "");
		return { value, label: value };
	});
}

export async function fetchBrands(search: string): Promise<FilterOption[]> {
	const field = SCHEMA.product.fields.brand;
	const query: any = {
		table: SCHEMA.product.table,
		orderBy: [{ path: field.name, orderType: "asc" }],
		distinct: true,
		select: [{ path: field.name }],
		take: 1000000
	};

	if (search) {
		query.filter = { op: "contains", path: field.name, value: search.trim().toLowerCase() };
	}

	const data = await mdtApi.rawFetch<{ payload: { rows: TabularRawRow[] } }>(query);

	return data.payload.rows.map((item) => {
		const value = String(item[field.name] ?? "");
		return { value, label: value };
	});
}

type CardsFetcherInput = BaseScope;

export type CardsRaw = {
	year: number;
	rows: Array<{ year: number; units: number; valueUsd: number; valueRub: number }>;
};

function buildCardsRequest(input: CardsFetcherInput): TabularRequest {
	return {
		select: [...MEASURE_COLS, YEAR_COL],
		take: 1000000,
		skip: 0,
		filter: { op: "and", groups: baseFilters(input) }
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

type DistributorsFetcherInput = BaseScope;

function buildDistributorsRequest(input: DistributorsFetcherInput): TabularRequest {
	return {
		select: [...MEASURE_COLS, column(SCHEMA.client, "client"), YEAR_COL],
		take: 1000000,
		skip: 0,
		filter: { op: "and", groups: baseFilters(input) }
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

export type BrandsRaw = {
	year: number;
	rows: Array<{ name: string; year: number; units: number; valueUsd: number; valueRub: number }>;
};

type BrandsFetcherInput = CounterpartyScope;

const BRAND_COL = column(SCHEMA.product, "brand");
const CLIENT_COL = column(SCHEMA.client, "client");

function buildBrandsRequest(input: BrandsFetcherInput): TabularRequest {
	const main = baseFilters(input);
	if (input.counterparties.length > 0) {
		main.push(
			inFilter(
				CLIENT_COL,
				input.counterparties.map((c) => c.value)
			)
		);
	}

	return {
		select: [...MEASURE_COLS, BRAND_COL, YEAR_COL],
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

type TrendFetcherInput = CounterpartyBrandScope;

const MONTH_COL = column(SCHEMA.calendar, "month");
const MONTH_RESP_FIELD = SCHEMA.calendar.fields.month.get as string;

function buildTrendDataRequest(input: TrendFetcherInput): TabularRequest {
	const main = baseFilters(input);
	if (input.counterparties.length > 0) {
		main.push(
			inFilter(
				CLIENT_COL,
				input.counterparties.map((c) => c.value)
			)
		);
	}
	if (input.brands.length > 0) {
		main.push(
			inFilter(
				BRAND_COL,
				input.brands.map((b) => b.value)
			)
		);
	}

	return {
		select: [...MEASURE_COLS, MONTH_COL, YEAR_COL],
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

type DistributorsByBrandInput = BrandScope;

function buildDistributorsByBrandRequest(input: DistributorsByBrandInput): TabularRequest {
	const main = baseFilters(input);
	if (input.brands.length > 0) {
		main.push(
			inFilter(
				BRAND_COL,
				input.brands.map((b) => b.value)
			)
		);
	}

	return {
		select: [...MEASURE_COLS, CLIENT_COL, YEAR_COL],
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
