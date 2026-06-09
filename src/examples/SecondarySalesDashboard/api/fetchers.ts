import {
	createMdtApiClient,
	type TabularColumnRef,
	type TabularFilter,
	type TabularRawRow,
	type TabularRequest
} from "../../../shared/api";
import { inFilter } from "../../../shared/bi-dashboard/api/filters";
import { buildPeriodFilter } from "../../../shared/bi-dashboard/api/period";
import { column, keyOf, SCHEMA } from "../../../shared/bi-dashboard/api/schema";
import type { BaseScope, BrandScope, CounterpartyBrandScope, CounterpartyScope } from "./scopes";

const API_URL = "https://modules-dev.ics-it.ru/typification/api/v2";
const mdtApi = createMdtApiClient(API_URL);

export type FilterOption = { value: string; label: string };

/** Колонки меры (unit/usd/rub) дашборда для tabular `select`. */
const MEASURE_COLS: TabularColumnRef[] = [
	column(SCHEMA.secondarySales, "unit"),
	column(SCHEMA.secondarySales, "usd"),
	column(SCHEMA.secondarySales, "rub")
];
const YEAR_COL = column(SCHEMA.calendar, "year");
const MONTH_COL = column(SCHEMA.calendar, "month");
const CLIENT_COL = column(SCHEMA.client, "client");
const BRAND_COL = column(SCHEMA.product, "brand");
const REGION_COL = column(SCHEMA.clientLocation, "region");
const MONTH_RESP_FIELD = SCHEMA.calendar.fields.month.get as string;

/** Ключи ответа для парсинга строк tabular (мера/группировка/год). */
const MEASURE_FIELD = {
	unit: keyOf(SCHEMA.secondarySales.fields.unit),
	usd: keyOf(SCHEMA.secondarySales.fields.usd),
	rub: keyOf(SCHEMA.secondarySales.fields.rub)
} as const;
const GROUP_FIELD = {
	counterparty: keyOf(SCHEMA.client.fields.client),
	brand: keyOf(SCHEMA.product.fields.brand),
	region: keyOf(SCHEMA.clientLocation.fields.region)
} as const;
const YEAR_FIELD = keyOf(SCHEMA.calendar.fields.year);

/** Загрузка опций справочника по плоскому tabular-объекту (distinct по одному полю). */
async function fetchDictionary(table: string, path: string, search: string): Promise<FilterOption[]> {
	const query: any = {
		table,
		orderBy: [{ path, orderType: "asc" }],
		distinct: true,
		select: [{ path }],
		take: 1000000
	};
	if (search) {
		query.filter = { op: "contains", path, value: search.trim().toLowerCase() };
	}
	const data = await mdtApi.rawFetch<{ payload: { rows: TabularRawRow[] } }>(query);
	return data.payload.rows.map((item) => {
		const value = String(item[path] ?? "");
		return { value, label: value };
	});
}

export function fetchDistributors(search: string): Promise<FilterOption[]> {
	return fetchDictionary(SCHEMA.client.table, SCHEMA.client.fields.client.name, search);
}

export function fetchBrands(search: string): Promise<FilterOption[]> {
	return fetchDictionary(SCHEMA.product.table, SCHEMA.product.fields.brand.name, search);
}

type CardsFetcherInput = BaseScope;

/** Базовые фильтры запроса данных: источник, тип привязки, два года, период. */
function baseFilters(input: CardsFetcherInput): TabularFilter[] {
	const main: TabularFilter[] = [
		{ op: "eq", column: column(SCHEMA.sourceType, "sourceType").column, value: input.sourceType },
		{ op: "eq", column: column(SCHEMA.bindType, "bindType").column, value: input.bindType },
		{ op: "in", column: YEAR_COL.column, list: [input.year - 1, input.year] }
	];
	const periodFilter = buildPeriodFilter(input.year, input.period);
	if (periodFilter) main.push(periodFilter);
	return main;
}

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
		select: [...MEASURE_COLS, CLIENT_COL, YEAR_COL],
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

export type RegionsRaw = {
	year: number;
	rows: Array<{ name: string; year: number; units: number; valueUsd: number; valueRub: number }>;
};

type RegionsFetcherInput = CounterpartyBrandScope;

function buildRegionsRequest(input: RegionsFetcherInput): TabularRequest {
	const main = baseFilters(input);
	if (input.counterparties.length > 0) {
		main.push(inFilter(CLIENT_COL, input.counterparties.map((c) => c.value)));
	}
	if (input.brands.length > 0) {
		main.push(inFilter(BRAND_COL, input.brands.map((b) => b.value)));
	}

	return {
		select: [...MEASURE_COLS, REGION_COL, YEAR_COL],
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

type BrandsFetcherInput = CounterpartyScope;

function buildBrandsRequest(input: BrandsFetcherInput): TabularRequest {
	const main = baseFilters(input);
	if (input.counterparties.length > 0) {
		main.push(inFilter(CLIENT_COL, input.counterparties.map((c) => c.value)));
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

function buildTrendDataRequest(input: TrendFetcherInput): TabularRequest {
	const main = baseFilters(input);
	if (input.counterparties.length > 0) {
		main.push(inFilter(CLIENT_COL, input.counterparties.map((c) => c.value)));
	}
	if (input.brands.length > 0) {
		main.push(inFilter(BRAND_COL, input.brands.map((b) => b.value)));
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
		main.push(inFilter(BRAND_COL, input.brands.map((b) => b.value)));
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

type RegionsByBrandInput = CounterpartyBrandScope;

function buildRegionsByBrandRequest(input: RegionsByBrandInput): TabularRequest {
	const main = baseFilters(input);
	if (input.brands.length > 0) {
		main.push(inFilter(BRAND_COL, input.brands.map((b) => b.value)));
	}
	if (input.counterparties.length > 0) {
		main.push(inFilter(CLIENT_COL, input.counterparties.map((c) => c.value)));
	}

	return {
		select: [...MEASURE_COLS, REGION_COL, YEAR_COL],
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
