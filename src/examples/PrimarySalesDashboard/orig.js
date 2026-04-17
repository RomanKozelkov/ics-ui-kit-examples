function nFormatter(num, K, M, B, T) {
	function toFixed(num, fixed) {
		var re = new RegExp("^-?\\d+(?:\\.\\d{0," + (fixed || -1) + "})?");
		return num.toString().match(re)?.[0] ?? "0";
	}

	const lookup = [
		{ value: 1, symbol: "" },
		{ value: 1e3, symbol: K },
		{ value: 1e6, symbol: M },
		{ value: 1e9, symbol: B },
		{ value: 1e12, symbol: T }
	];

	const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/;
	const item = lookup
		.reverse()
		.find((item) => (num < 0 ? num <= -item.value : num >= item.value));
	const finalValue = item
		? toFixed(num / item.value, 1)
				.replace(regexp, "")
				.concat(`${item.symbol}`)
		: "0";

	return finalValue.replace(".", ",");
}

function valueByPath(record, path) {
	const pathItems = path.split("/");
	let value = record;
	if (value == null) return value;
	for (let i = 0; i < pathItems.length; i++) {
		let item = pathItems[i];
		if (i !== pathItems.length - 1) item += "$";
		value = value[item];
	}
	return value;
}

class FilterStorage {
	constructor(key) {
		this.key = key;
	}

	getValue(fieldCode) {
		const value = this._getValue();
		return value.state?.[fieldCode]?.value ?? null;
	}

	setValue(fieldCode, value) {
		const currentValue = this._getValue();
		if (!currentValue.state) currentValue.state = {};
		if (!currentValue.state[fieldCode]) currentValue.state[fieldCode] = {};
		currentValue.state[fieldCode].value = value;
		localStorage.setItem(this.key, JSON.stringify(currentValue));
	}

	clearAll() {
		localStorage.removeItem(this.key);
	}

	_getValue() {
		const value = localStorage.getItem(this.key);
		return value ? JSON.parse(value) : {};
	}
}

function clearNulls(filter) {
	if (!filter) {
		return undefined;
	}

	if (filter.hasOwnProperty("groups") && Array.isArray(filter.groups)) {
		filter.groups = filter.groups
			.map(clearNulls)
			.filter((group) => group !== undefined);
		if (filter.groups.length === 0) {
			return undefined;
		}
	}
	return filter;
}

function parseFilterToTabular(filter) {
	if (!filter) return filter;

	if (filter.hasOwnProperty("p1") && localOnlyFilters.includes(filter.p1)) {
		return undefined;
	}

	const pathToColumn = Object.fromEntries(
		filtersTransform.map((entry) => {
			const col = Object.values(entry)[0];
			return [col.name, col];
		})
	);

	if (filter.hasOwnProperty("p1")) {
		const path = filter.p1;
		delete filter.p1;
		filter.column = pathToColumn[path] || { name: path };
	}
	if (filter.hasOwnProperty("p2")) {
		if (filter.op === "in") filter.list = filter.p2;
		else filter.value = filter.p2;
		delete filter.p2;
	}
	if (filter.column && filter.column.name === "Year") {
		if (filter.op === "in" && Array.isArray(filter.list)) {
			const expanded = new Set();
			for (const year of filter.list) {
				expanded.add(year - 1);
				expanded.add(year);
			}
			filter.list = [...expanded].sort((a, b) => a - b);
		} else if (filter.op === "eq" && filter.value != null) {
			filter.op = "in";
			filter.list = [filter.value - 1, filter.value];
			delete filter.value;
		}
	}
	if (filter.hasOwnProperty("groups") && Array.isArray(filter.groups)) {
		filter.groups = filter.groups
			.map((g) => parseFilterToTabular(g))
			.filter((g) => g != null);
	}
	return clearNulls(filter);
}

function extractYearFromFilter(filter) {
	if (!filter) return null;
	if (filter.p1 === "Year") {
		return Array.isArray(filter.p2) ? Math.max(...filter.p2) : filter.p2;
	}
	if (filter.groups && Array.isArray(filter.groups)) {
		for (const group of filter.groups) {
			const year = extractYearFromFilter(group);
			if (year != null) return year;
		}
	}
	return null;
}

function parseFilterToCommon(filter, onlyYears = false) {
	if (!filter) return [];

	const values = filter.getValues();

	return Object.keys(values)
		.map((key) => {
			if (localOnlyFilters.includes(key)) return null;
			const transform = filtersTransform.find((item) =>
				item.hasOwnProperty(key)
			);
			if (!transform) return null;

			const rawValue = values[key];
			let valueList = Array.isArray(rawValue) ? rawValue : [rawValue];

			if (key === "Year") {
				valueList = valueList.flatMap((year) => [year - 1, year]);
			}

			if (
				!["Year", "Source Type", "Bind Type"].includes(key) &&
				onlyYears
			) {
				valueList = [];
			}

			return {
				op: "in",
				column: {
					table: transform[key].table,
					name: transform[key].name
				},
				list: valueList
			};
		})
		.filter((item) => item !== null);
}

class SchemaFacade {
	constructor() {
		this.schema = legacy.SchemaManagerInstance;
	}

	refresh() {
		this.schema.refresh(true);
	}

	createTable(table) {
		if (this.schema.get(table.code, true))
			return this.schema.get(table.code);

		const preapred = this.schema.prepare(table);
		this.schema.add(preapred);
		return preapred;
	}

	createVirtualDistr({ fields }) {
		return this.createTable({
			code: "DistributorSalesTable",
			defaultFieldCode: "Name",
			inline_Enabled: false,
			$datasource: {
				fetch: async (query) => {
					const {
						currentYear,
						valueCol,
						valueField,
						combinedFilter
					} = prepareContext(query.filter, { isTable: true });
					const result = await Api.request(
						"tabular/fetch",
						{
							select: [
								valueCol.select,
								{
									column: {
										table: "Counterparty~Tabular",
										name: "Counterparty"
									}
								},
								{
									column: {
										table: "Calendar~Tabular",
										name: "Year"
									}
								}
							],
							take: 10000,
							skip: 0,
							filter: combinedFilter
						},
						{ method: "POST" }
					);
					return aggregateByGroup(
						result.rows,
						valueField,
						"Counterparty[Counterparty]",
						currentYear
					);
				}
			},
			fields: [
				{ code: "SortOrder", type: "number" },
				{ code: "Name", primary: true, type: "string" },
				{ code: "Sales", type: "number" },
				{ code: "YOY%", type: "number" },
				{ code: "Share", type: "string" },
				{ code: "Rank", type: "number" }
			]
		});
	}

	createVirtualBrand({ fields }) {
		return this.createTable({
			code: "BrandSalesTable",
			defaultFieldCode: "Name",
			inline_Enabled: false,
			$datasource: {
				fetch: async (query) => {
					const {
						currentYear,
						valueCol,
						valueField,
						combinedFilter
					} = prepareContext(query.filter, { isTable: true });
					const result = await Api.request(
						"tabular/fetch",
						{
							select: [
								valueCol.select,
								{
									column: {
										table: "Product~Tabular",
										name: "Product Brand"
									}
								},
								{
									column: {
										table: "Calendar~Tabular",
										name: "Year"
									}
								}
							],
							take: 10000,
							skip: 0,
							filter: combinedFilter
						},
						{ method: "POST" }
					);
					return aggregateByGroup(
						result.rows,
						valueField,
						"Product[Product Brand]",
						currentYear
					);
				}
			},
			fields: [
				{ code: "SortOrder", type: "number" },
				{ code: "Name", primary: true, type: "string" },
				{ code: "Sales", type: "number" },
				{ code: "YOY%", type: "number" },
				{ code: "Share", type: "string" },
				{ code: "Rank", type: "number" }
			]
		});
	}
}

const filtersObjectCode = "testDashboardFromModule";
const filterStorage = new FilterStorage("tabularDashboardFilterState");
const mdtSchema = new SchemaFacade();
const distributorTable = mdtSchema.createVirtualDistr({
	fields: ["SortOrder", "Name", "Sales"]
});

const brandTable = mdtSchema.createVirtualBrand({
	fields: ["SortOrder", "Name", "Sales"]
});

const baseFilterByFields = [
	{
		fieldCode: "Year",
		fieldPath: "Year",
		handleValue: (year) => year ?? 2025
	},
	{
		fieldCode: "Source Type",
		fieldPath: "Source Type"
	},
	{
		fieldCode: "Bind Type",
		fieldPath: "Bind Type"
	},
	{
		fieldCode: "Currency",
		fieldPath: "Currency"
	},
	{
		fieldCode: "Metric",
		fieldPath: "Metric"
	},
	{
		fieldCode: "Period",
		fieldPath: "Period"
	}
];

const mainChartFilterByFields = [
	...baseFilterByFields,
	{
		fieldCode: "Counterparty",
		fieldPath: "Counterparty"
	},
	{
		fieldCode: "Brand",
		fieldPath: "Product Brand"
	}
];

const brandFilterByFields = mainChartFilterByFields.filter(
	(f) => f.fieldCode !== "Brand"
);

const distrFilterByFields = mainChartFilterByFields.filter(
	(f) => f.fieldCode !== "Counterparty"
);

const filtersTransform = [
	{
		Brand: {
			table: "Product~Tabular",
			name: "Product Brand"
		}
	},
	{
		Counterparty: {
			table: "Counterparty~Tabular",
			name: "Counterparty"
		}
	},
	{
		Year: {
			table: "Calendar~Tabular",
			name: "Year"
		}
	},
	{
		"Source Type": {
			table: "Source Type~Tabular",
			name: "Source Type"
		}
	},
	{
		"Bind Type": {
			table: "Bind Type~Tabular",
			name: "Bind Type"
		}
	}
];

const localOnlyFilters = ["Metric", "Currency", "Period"];

function filterRecordsWithChartKeyOnly(records, key) {
	return records.filter((rec) => {
		const keys = Object.keys(rec);
		if (keys.length === 1 && keys[0] === key) return false;
		return true;
	});
}

function splitByYear(rows, valueField, groupField, groupName, selectedYear) {
	const currentYear = selectedYear;
	const previousYear = selectedYear - 1;

	const calcYoY = (cur, prev) =>
		prev && cur ? Math.round(((cur - prev) / prev) * 100) : undefined;

	if (!groupField) {
		const record = { "Selected Year": null, "Previous Year": null };
		for (const row of rows) {
			if (row["Calendar[Year]"] === currentYear) {
				record["Selected Year"] = Math.round(row[valueField]);
			} else if (row["Calendar[Year]"] === previousYear) {
				record["Previous Year"] = Math.round(row[valueField]);
			}
		}
		record["diff"] = calcYoY(
			record["Selected Year"],
			record["Previous Year"]
		);
		return [record];
	}

	const byKey = {};
	for (const row of rows) {
		const key = row[groupField];
		if (!byKey[key]) {
			byKey[key] = {
				[groupName || groupField]: key,
				"Selected Year": null,
				"Previous Year": null
			};
		}
		if (row["Calendar[Year]"] === currentYear) {
			byKey[key]["Selected Year"] = Math.round(row[valueField]);
		} else if (row["Calendar[Year]"] === previousYear) {
			byKey[key]["Previous Year"] = Math.round(row[valueField]);
		}
	}
	return Object.values(byKey).map((item) => {
		const yoy = calcYoY(item["Selected Year"], item["Previous Year"]);
		return {
			...item,
			"YoY+, %": yoy != null && yoy >= 0 ? yoy : undefined,
			"YoY-, %": yoy != null && yoy < 0 ? yoy : undefined
		};
	});
}

function generatePeriodDateIds(selectedYear, period) {
	if (period === "FY") return null;

	const today = new Date();
	const currentMonth = today.getMonth();
	const currentDay = today.getDate();

	let startMonth;
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

	const ids = [];
	const previousYear = selectedYear - 1;

	for (const year of [selectedYear, previousYear]) {
		const start = new Date(year, startMonth, 1);
		const end = new Date(year, currentMonth, currentDay);

		for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
			const y = d.getFullYear();
			const m = String(d.getMonth() + 1).padStart(2, "0");
			const day = String(d.getDate()).padStart(2, "0");
			ids.push(Number(`${y}${m}${day}`));
		}
	}

	return ids;
}

const currentValues = {
	currency: "RUB"
};

function getValueColumn(metric, currency) {
	let name = "Primary Sales, INV RUB";
	if (metric === "Units") name = "Primary Sales, unit";
	else if (currency === "USD") name = "Primary Sales, USD conversion";
	return {
		field: "[" + name + "]",
		select: { column: { table: "Primary Sales~Tabular", name } }
	};
}

function prepareContext(
	filter,
	{ onlyYears = false, metricOverride, isTable = false } = {}
) {
	const filterValues = isTable ? null : filter.getValues();
	const getParam = (key) =>
		isTable ? filterStorage.getValue(key) : filterValues[key];

	const metric = metricOverride || getParam("Metric");
	const currency = getParam("Currency");
	const period = getParam("Period");

	let currentYear, resultFilter;
	if (isTable) {
		currentYear = extractYearFromFilter(filter);
		resultFilter = parseFilterToTabular(filter);
	} else {
		resultFilter = parseFilterToCommon(filter, onlyYears);
		currentYear = Math.max(
			...resultFilter.find((f) => f.column.name === "Year").list
		);
	}

	const valueCol = getValueColumn(metric, currency);
	const periodIds = generatePeriodDateIds(currentYear, period);
	const periodCondition = periodIds
		? {
				op: "in",
				column: { table: "Calendar~Tabular", name: "ID" },
				list: periodIds
			}
		: null;

	if (isTable) {
		let combinedFilter = resultFilter;
		if (periodCondition) {
			combinedFilter = resultFilter
				? { op: "and", groups: [resultFilter, periodCondition] }
				: periodCondition;
		}
		return {
			currentYear,
			previousYear: currentYear - 1,
			valueCol,
			valueField: valueCol.field,
			combinedFilter
		};
	}

	if (periodCondition) resultFilter.push(periodCondition);
	return {
		transformedFilter: resultFilter,
		selectedYear: currentYear,
		metric,
		currency,
		period,
		valueCol,
		valueField: valueCol.field
	};
}

function aggregateByGroup(rows, valueField, groupField, currentYear) {
	const previousYear = currentYear - 1;
	const byName = {};
	for (const row of rows) {
		const name = row[groupField];
		if (!byName[name]) byName[name] = { current: null, previous: null };
		if (row["Calendar[Year]"] === currentYear) {
			byName[name].current = row[valueField];
		} else if (row["Calendar[Year]"] === previousYear) {
			byName[name].previous = row[valueField];
		}
	}

	const totalCurrent = Object.values(byName).reduce(
		(sum, v) => sum + v.current,
		0
	);

	const currentRecords = Object.entries(byName)
		.map(([name, data]) => ({
			Name: name,
			Sales: Math.round(data.current),
			PrevSales: Math.round(data.previous)
		}))
		.sort((a, b) => b.Sales - a.Sales)
		.map((row, index) => ({ ...row, SortOrder: index + 1 }));

	const prevSortMap = {};
	Object.entries(byName)
		.map(([name, data]) => ({ Name: name, Sales: data.previous }))
		.sort((a, b) => b.Sales - a.Sales)
		.forEach((row, index) => {
			prevSortMap[row.Name] = index + 1;
		});

	return {
		records: currentRecords.map((row) => {
			const yoy = row.PrevSales
				? Math.round(
						((row.Sales - row.PrevSales) / row.PrevSales) * 100
					)
				: null;
			const share = totalCurrent
				? Math.round((row.Sales / totalCurrent) * 100)
				: 0;
			const prevSort = prevSortMap[row.Name];
			const rank = prevSort != null ? prevSort - row.SortOrder : 0;
			return {
				SortOrder: row.SortOrder,
				Name: row.Name,
				Sales: row.Sales,
				"YOY%": yoy,
				Share: share + "%",
				Rank: rank
			};
		})
	};
}

const DASHBOARD_ITEM_HEIGHT_PX = 300;

Navigation.addNode({
	code: "movementDashboard",
	title: "Дашборды",
	icon: "chart-mixed",
	position: 100
});

ReportDashboard.createNode(
	{
		code: "report-dashboard-primarySales",
		title: "Primary Sales",
		icon: "chart-line",
		parentPath: "movementDashboard",
		controlCode: "dashboard",
		position: 30,
		controlTemplate: {
			code: "$dashboard_Primary_script"
		}
	},
	{
		dynamicCharts: {
			cardPrimarySalesValue: {
				update: async ({ filter, type }) => {
					const {
						transformedFilter,
						selectedYear,
						currency,
						valueCol,
						valueField
					} = prepareContext(filter, {
						onlyYears: true,
						metricOverride: "Value"
					});
					const result = await Api.request(
						"tabular/fetch",
						{
							select: [
								valueCol.select,
								{
									column: {
										table: "Calendar~Tabular",
										name: "Year"
									}
								}
							],
							take: 1000,
							skip: 0,
							filter: {
								op: "and",
								groups: transformedFilter
							}
						},
						{ method: "POST" }
					);
					const data = splitByYear(
						result.rows,
						valueField,
						undefined,
						undefined,
						selectedYear
					).map((row) => {
						return {
							...row,
							PY_Formatted: Utils.format(row["Previous Year"], {
								type: "number"
							})
						};
					});
					let reCreate = false;
					if (currentValues.currency !== currency) {
						currentValues.currency = currency;
						reCreate = true;
					}
					return {
						reCreate: reCreate,
						data: data,
						controlOptions: {
							type: "card",
							title:
								currency === "RUB"
									? "Primary Sales, RUB"
									: "Primary Sales, USD",
							value: {
								field: "Selected Year",
								template: "{Selected Year}",
								dataType: "number"
							},
							height: 100,
							color: {
								range: [{ color: "black" }]
							},
							style: {
								backgroundColor: "#fafafa"
							},
							changesBlock: {
								layout: {
									direction: "column"
								},
								items: [
									{
										value: {
											field: "diff",
											template:
												"{diff}% vs PY ({PY_Formatted})",
											dataType: "number"
										},
										color: {
											range: [
												{ color: "red" },
												{ value: 0, color: "black" },
												{ value: 0, color: "green" }
											]
										}
									}
								]
							}
						}
					};
				},
				filterByFields: baseFilterByFields
			},
			baseChart: {
				update: async ({ filter, type }) => {
					const {
						transformedFilter,
						selectedYear,
						period,
						valueCol,
						valueField
					} = prepareContext(filter);

					const isMTD = period === "MTD";
					const allMonths = [
						"Jan",
						"Feb",
						"Mar",
						"Apr",
						"May",
						"Jun",
						"Jul",
						"Aug",
						"Sep",
						"Oct",
						"Nov",
						"Dec"
					];

					const result = await Api.request(
						"tabular/fetch",
						{
							select: [
								valueCol.select,
								{
									column: {
										table: "Calendar~Tabular",
										name: "Month"
									}
								},
								{
									column: {
										table: "Calendar~Tabular",
										name: "Year"
									}
								}
							],
							take: 1000,
							skip: 0,
							filter: {
								op: "and",
								groups: transformedFilter
							}
						},
						{ method: "POST" }
					);

					const data = splitByYear(
						result.rows,
						valueField,
						"Calendar[Month]",
						"Month",
						selectedYear
					);

					let charts;
					let axes;
					let legend;

					if (isMTD) {
						legend = true;
						charts = [
							{
								type: "bar",
								isSegmented: false,
								data: {
									valueFields: [
										{
											name: "Previous Year",
											color: "#bfbfbf"
										},
										{
											name: "Selected Year",
											color: "#209ce2"
										}
									]
								}
							}
						];
					} else {
						const existingMonths = new Set(
							data.map((r) => r.Month)
						);
						for (const month of allMonths) {
							if (!existingMonths.has(month)) {
								data.push({
									Month: month,
									"Selected Year": null,
									"Previous Year": null
								});
							}
						}
						data.sort(
							(a, b) =>
								allMonths.indexOf(a.Month) -
								allMonths.indexOf(b.Month)
						);
						axes = {
							valueSecondary: {
								domain: (options) => {
									const fields = ["YoY+, %", "YoY-, %"];
									let maxValue = 0;
									options.data.forEach((row) => {
										fields.forEach((field) => {
											const value = row[field];
											if (value > maxValue)
												maxValue = value;
										});
									});
									return {
										start: -100,
										end:
											(Math.round(maxValue / 50) + 1) * 50
									};
								},
								stepSize: 30
							},
							value: {
								domain: (options) => {
									const fields = [
										"Selected Year",
										"Previous Year"
									];
									let maxValue = 0;
									let minValue = 1000000000000;
									options.data.forEach((row) => {
										fields.forEach((field) => {
											const value = row[field];
											if (
												value > maxValue &&
												value !== null
											)
												maxValue = value;
											if (
												value < minValue &&
												value !== null
											)
												minValue = value;
										});
									});
									return {
										start:
											minValue === 1000000000000
												? 0
												: Math.round(
														minValue /
															10 **
																(minValue.toString()
																	.length -
																	2)
													) *
													10 **
														(minValue.toString()
															.length -
															2),
										end:
											maxValue === 0
												? 0
												: (Math.round(
														maxValue /
															10 **
																(maxValue.toString()
																	.length -
																	2)
													) +
														1) *
													10 **
														(maxValue.toString()
															.length -
															2)
									};
								},
								stepSize: 30,
								formatValue: `(value) => { ${nFormatter.toString()}; return nFormatter(value, ${JSON.stringify("K")}, ${JSON.stringify("M")}, ${JSON.stringify("B")}, ${JSON.stringify("T")}) }`
							}
						};
						charts = [
							{
								type: "bar",
								isSegmented: true,
								valueLabels: {
									on: true,
									format: ({ value }) => value + " %"
								},
								data: {
									secondaryValue: true,
									valueFields: [
										{ name: "YoY+, %", color: "#4fff4f" },
										{ name: "YoY-, %", color: "#ff4747" }
									]
								}
							},
							{
								type: "area",
								data: {
									valueFields: [
										{
											name: "Selected Year",
											color: "#209ce2"
										}
									]
								}
							},
							{
								type: "line",
								dash: { on: true, dashSize: 5 },
								data: {
									valueFields: [
										{
											name: "Previous Year",
											color: "#bfbfbf"
										}
									]
								}
							}
						];
					}

					return {
						reCreate: true,
						data: data,
						controlOptions: {
							type: "2d",
							keyField: "Month",
							height: DASHBOARD_ITEM_HEIGHT_PX,
							legend: legend,
							commonCanvasOptions: {
								bar: {
									maxBarWidth: 10000
								}
							},
							axes: axes,
							charts: charts,
							tooltip: {
								rows: {
									filterPredicate: (row) =>
										row.textContent.value != null
								}
							}
						}
					};
				},
				filterByFields: mainChartFilterByFields
			},
			driversChart: {
				defaultItem: "Brands, %",
				items: [
					"Brands, %",
					"Brands, value",
					"Distributors, %",
					"Distributors, value"
				],
				update: async ({ filter, type }) => {
					const {
						transformedFilter,
						selectedYear,
						valueCol,
						valueField
					} = prepareContext(filter);

					const isBrands = type.startsWith("Brands");
					const isPercent = type.endsWith("%");

					const driversFilter = transformedFilter.filter(
						(item) =>
							item["column"]["name"] !==
							(isBrands ? "Product Brand" : "Counterparty")
					);

					const groupColumn = isBrands
						? {
								column: {
									table: "Product~Tabular",
									name: "Product Brand"
								}
							}
						: {
								column: {
									table: "Counterparty~Tabular",
									name: "Counterparty"
								}
							};
					const groupField = isBrands
						? "Product[Product Brand]"
						: "Counterparty[Counterparty]";
					const groupName = isBrands ? "Brand" : "Distributor";

					const result = await Api.request(
						"tabular/fetch",
						{
							select: [
								valueCol.select,
								groupColumn,
								{
									column: {
										table: "Calendar~Tabular",
										name: "Year"
									}
								}
							],
							take: 10000,
							skip: 0,
							filter: {
								op: "and",
								groups: driversFilter
							}
						},
						{ method: "POST" }
					);
					let data = splitByYear(
						result.rows,
						valueField,
						groupField,
						groupName,
						selectedYear
					);

					let withDiff;
					if (isPercent) {
						withDiff = data
							.map((item) => {
								const cur = item["Selected Year"];
								const prev = item["Previous Year"];
								const pctDiff = prev
									? Math.round(((cur - prev) / prev) * 100)
									: null;
								return { name: item[groupName], diff: pctDiff };
							})
							.filter((item) => item.diff != null)
							.sort((a, b) => b.diff - a.diff);
					} else {
						withDiff = data
							.map((item) => ({
								name: item[groupName],
								diff:
									item["Selected Year"] -
									item["Previous Year"]
							}))
							.sort((a, b) => b.diff - a.diff);
					}

					const top5 = withDiff.slice(0, 5);
					const bottom5 = withDiff.slice(-5);
					const selected = [
						...new Map(
							[...top5, ...bottom5].map((i) => [i.name, i])
						).values()
					];
					selected.sort((a, b) => b.diff - a.diff);

					data = selected.map((item) => ({
						[groupName]: item.name,
						Рост: item.diff >= 0 ? item.diff : undefined,
						Падение: item.diff < 0 ? item.diff : undefined
					}));
					return {
						reCreate: true,
						data: data,
						controlOptions: {
							type: "2d",
							keyField: groupName,
							height: DASHBOARD_ITEM_HEIGHT_PX,
							title: "Драйверы роста / падения",
							legend: true,
							commonCanvasOptions: {
								bar: {
									maxBarWidth: 10000
								}
							},
							charts: [
								{
									type: "bar",
									isSegmented: true,
									data: {
										valueFields: [
											{
												name: "Рост",
												color: "#4fff4f"
											},
											{
												name: "Падение",
												color: "#ff4747"
											}
										]
									}
								}
							],
							axes: {
								orientation: "horizontal",
								value: {
									domain: (options) => {
										const fields = ["Рост", "Падение"];

										let maxValue = 0;
										let minValue = 1000000000000;

										options.data.forEach((row) => {
											fields.forEach((field) => {
												const value = row[field];
												if (
													value > maxValue &&
													value !== null
												)
													maxValue = value;
												if (
													value < minValue &&
													value !== null
												)
													minValue = value;
											});
										});
										if (isPercent) {
											minValue = -100;
											maxValue =
												(Math.round(maxValue / 50) +
													1) *
												50;
										} else {
											minValue =
												minValue === 1000000000000
													? 0
													: (Math.round(
															minValue /
																10 **
																	(minValue.toString()
																		.length -
																		(minValue <
																		0
																			? 2
																			: 1))
														) +
															(minValue < 0
																? -1
																: 0)) *
														10 **
															(minValue.toString()
																.length -
																(minValue < 0
																	? 2
																	: 1));
											maxValue =
												Math.round(
													maxValue /
														10 **
															(maxValue.toString()
																.length -
																1)
												) *
												(10 **
													(maxValue.toString()
														.length -
														1) +
													1);
										}

										return {
											start: minValue,
											end: maxValue
										};
									},
									stepSize: 50,
									formatValue: isPercent
										? ""
										: `(value) => { ${nFormatter.toString()}; return nFormatter(value, ${JSON.stringify("K")}, ${JSON.stringify("M")}, ${JSON.stringify("B")}, ${JSON.stringify("T")}) }`
								}
							},
							tooltip: {
								rows: {
									filterPredicate: (row) =>
										row.textContent.value != null
								}
							}
						}
					};
				},
				filterByFields: mainChartFilterByFields
			}
		},
		defaultCharts: {
			cardPrimarySalesUnit: {
				options: {
					type: "card",
					title: "Primary Sales, Units",
					value: {
						field: "Selected Year",
						template: "{Selected Year}",
						dataType: "number"
					},
					height: 100,
					color: {
						range: [{ color: "black" }]
					},
					style: {
						backgroundColor: "#fafafa"
					},
					changesBlock: {
						layout: {
							direction: "column"
						},
						items: [
							{
								value: {
									field: "diff",
									template: "{diff}% vs PY ({PY_Formatted})",
									dataType: "number"
								},
								color: {
									range: [
										{ color: "red" },
										{ value: 0, color: "black" },
										{ value: 0, color: "green" }
									]
								}
							}
						]
					}
				},
				fetch: async ({ filter }) => {
					const { transformedFilter, selectedYear } = prepareContext(
						filter,
						{ onlyYears: true }
					);
					const result = await Api.request(
						"tabular/fetch",
						{
							select: [
								{
									column: {
										table: "Primary Sales~Tabular",
										name: "Primary Sales, unit"
									}
								},
								{
									column: {
										table: "Calendar~Tabular",
										name: "Year"
									}
								}
							],
							take: 1000,
							skip: 0,
							filter: {
								op: "and",
								groups: transformedFilter
							}
						},
						{ method: "POST" }
					);
					return splitByYear(
						result.rows,
						"[Primary Sales, unit]",
						undefined,
						undefined,
						selectedYear
					).map((row) => {
						return {
							...row,
							PY_Formatted: Utils.format(row["Previous Year"], {
								type: "number"
							})
						};
					});
				},
				filterByFields: baseFilterByFields
			}
		},
		filters: {
			code: filtersObjectCode,
			params: [
				{
					code: "Year",
					title: "Год анализа",
					type: "field",
					reference: {
						type: "single",
						datasource: {
							type: "proxyObject",
							originalObjectCode: "Calendar~Tabular",
							primaryFieldCode: "Year",
							defaultFieldCode: "Year"
						}
					},
					defaultValue: 2025
				},
				{
					code: "Counterparty",
					title: "Дистрибьютор",
					type: "field",
					reference: {
						type: "multi",
						datasource: {
							type: "virtualObject",
							object: {
								code: "CounterpartyFilter",
								fetch: async () => {
									const response =
										await Api.fetch("md.DirectCompany");
									const records = response.records || [];
									return records.map((row) => {
										return {
											Counterparty: valueByPath(
												row,
												"ID_Company/vw_Company_AdditionalInfo_o2o/Name"
											)
										};
									});
								},
								fields: [
									{
										code: "Counterparty",
										primary: true,
										default: true
									}
								]
							}
						}
					}
				},
				{
					code: "Brand",
					title: "Бренды",
					type: "field",
					reference: {
						type: "multi",
						datasource: {
							type: "proxyObject",
							originalObjectCode: "Product~Tabular",
							primaryFieldCode: "Product Brand",
							defaultFieldCode: "Product Brand"
						}
					}
				},
				{
					code: "Source Type",
					title: "Источник данных",
					type: "field",
					reference: {
						type: "single",
						datasource: {
							type: "proxyObject",
							originalObjectCode: "Source Type~Tabular",
							primaryFieldCode: "Source Type",
							defaultFieldCode: "Source Type"
						}
					},
					defaultValue: "MDLP"
				},
				{
					code: "Bind Type",
					title: "Тип атрибутов",
					type: "field",
					reference: {
						type: "single",
						datasource: {
							type: "proxyObject",
							originalObjectCode: "Bind Type~Tabular",
							primaryFieldCode: "Bind Type",
							defaultFieldCode: "Bind Type"
						}
					},
					defaultValue: "History"
				},
				{
					code: "Currency",
					title: "Валюта",
					type: "field",
					reference: {
						type: "single",
						datasource: {
							type: "proxyObject",
							originalObjectCode: "dq.Currency",
							primaryFieldCode: "Code",
							defaultFieldCode: "Code"
						}
					},
					defaultValue: "RUB"
				},
				{
					code: "Metric",
					title: "Метрика",
					type: "field",
					reference: {
						type: "single",
						datasource: {
							type: "virtualObject",
							object: {
								code: "MetricTable",
								fetch: async () => {
									return [
										{ metric: "Value" },
										{ metric: "Units" }
									];
								},
								fields: [
									{
										code: "metric",
										primary: true,
										default: true
									}
								]
							}
						}
					},
					defaultValue: "Units"
				},
				{
					code: "Period",
					title: "Период",
					type: "field",
					reference: {
						type: "single",
						datasource: {
							type: "virtualObject",
							object: {
								code: "PeriodFilter",
								fetch: async () => {
									return [
										{ Code: "FY" },
										{ Code: "YTD" },
										{ Code: "QTD" },
										{ Code: "MTD" }
									];
								},
								fields: [
									{
										code: "Code",
										primary: true,
										default: true
									}
								]
							}
						}
					},
					defaultValue: "FY"
				}
			]
		},
		lists: [
			{
				id: "DistributorSalesTable",
				datasource: {
					objectCode: "DistributorSalesTable"
				},
				filterByFields: distrFilterByFields
			},
			{
				id: "BrandSalesTable",
				datasource: {
					objectCode: "BrandSalesTable"
				},
				filterByFields: brandFilterByFields
			}
		],
		events: {
			clearAllFilters: () => filterStorage.clearAll(),
			fieldUpdated: ({ dashboard, fieldCode, value }) => {
				const getMultiPickerValue = (value) => {
					const copyValue = [...value];
					return copyValue.map((item) => {
						const { $diff, $dirty, $id, $table, ...restFields } =
							item;
						delete restFields[`ID_${filtersObjectCode}$`];

						const tabularIdField = Object.keys(restFields).find(
							(fieldName) => fieldName.endsWith("$")
						);
						if (
							tabularIdField &&
							restFields[tabularIdField]?.$table
						) {
							delete restFields[tabularIdField].$table;
						}

						return restFields;
					});
				};

				if (
					Schema.getObject(filtersObjectCode)
						.getField(fieldCode)
						.isOne2Many()
				)
					filterStorage.setValue(
						fieldCode,
						getMultiPickerValue(value)
					);
				else filterStorage.setValue(fieldCode, value);
			},
			stateInited: ({ dashboard }) => {
				Schema.getObject(filtersObjectCode)
					.getFields()
					.forEach((field) => {
						let storedValue = filterStorage.getValue(
							field.getCode()
						);
						if (storedValue && field.getCode() != "Bind Type") {
							dashboard.fields.setValue(
								field.getCode(),
								storedValue
							);
						}
					});
			}
		},
		mdtLayout: ({ dashboard, items }) => {
			return {
				rows: [
					{
						cols: [
							{
								type: "panel",
								width: 12,
								options: {
									title: "Фильтры",
									icon: "filter",
									collapsible: true,
									collapsed: false,
									layout: {
										rows: [
											{
												cols: [
													items.field(
														"Counterparty",
														2,
														{
															title: "Дистрибьютор",
															control:
																"o2m-inline",
															hintSorting: [
																{
																	path: "Counterparty"
																}
															],
															modalOptions: {
																title: "Дистрибьютор"
															}
														}
													),
													items.field("Brand", 2, {
														title: "Бренд",
														control: "o2m-inline",
														hintSorting: [
															{
																path: "Product Brand"
															}
														],
														modalOptions: {
															title: "Бренд"
														}
													}),
													items.field("Year", 1, {
														title: "Год анализа",
														control: "select"
													}),
													items.field("Period", 1, {
														title: "Период",
														control: "radio-picker"
													}),
													items.field("Metric", 1, {
														title: "Метрика",
														control: "radio-picker"
													}),
													items.field("Currency", 1, {
														title: "Валюта",
														control: "radio-picker",
														filter: () => {
															let filter = {
																op: "in",
																p1: "Code",
																p2: [
																	"RUB",
																	"USD"
																]
															};
															return filter;
														}
													}),
													items.field(
														"Source Type",
														2,
														{
															title: "Источник данных",
															control:
																"radio-picker"
														}
													)
												]
											}
										]
									}
								}
							},
							items.dynamicChart("cardPrimarySalesValue", 6),
							items.defaultChart("cardPrimarySalesUnit", 6),
							items.dynamicChart("baseChart", 8),
							items.dynamicChart("driversChart", 4),
							items.list("DistributorSalesTable", 6, {
								options: {
									layout: {
										columns: [
											{
												fieldPath: "SortOrder",
												title: "№",
												width: 50
											},
											{
												fieldPath: "Name",
												title: "Дистрибьютор",
												width: 250
											},
											{
												fieldPath: "Sales",
												title: "Sales",
												width: 175
											},
											{
												fieldPath: "YOY%",
												title: "YOY%",
												width: 80
											},
											{
												fieldPath: "Share",
												title: "Share",
												width: 80
											},
											{
												fieldPath: "Rank",
												title: "Rank",
												width: 80
											}
										]
									}
								},
								hideTitle: true,
								extConfig: {
									namedFilter: false,
									listView: false,
									form: false,
									merge: false,
									toolbar: false
								}
							}),
							items.list("BrandSalesTable", 6, {
								options: {
									layout: {
										columns: [
											{
												fieldPath: "SortOrder",
												title: "№",
												width: 50
											},
											{
												fieldPath: "Name",
												title: "Бренд",
												width: 250
											},
											{
												fieldPath: "Sales",
												title: "Sales",
												width: 175
											},
											{
												fieldPath: "YOY%",
												title: "YOY%",
												width: 80
											},
											{
												fieldPath: "Share",
												title: "Share",
												width: 80
											},
											{
												fieldPath: "Rank",
												title: "Rank",
												width: 80
											}
										]
									}
								},
								hideTitle: true,
								extConfig: {
									namedFilter: false,
									listView: false,
									form: false,
									merge: false,
									toolbar: false
								}
							})
						]
					}
				]
			};
		}
	}
);

ListService.onCreate((list) => {
	const fields = ["YOY%", "Rank"];

	list.addTransformerForCell((cell) => {
		const { code } = cell.col;

		if (!fields.includes(code)) return;

		let value = parseFloat(cell.record[code]);

		const plus_symbol = value <= 0 ? "" : "+";
		const percent_nedded = code === "Rank" ? "" : "%";

		if (value < 0) {
			cell.addStyle("color", "red");
		} else if (value > 0 || isNaN(value)) {
			cell.addStyle("color", "green");
		}

		const final_value = (value) => {
			if (value === 0 && code === "Rank") return "—";
			if (isNaN(value)) return "\u221E";
			return value;
		};

		cell.setContent([
			`${plus_symbol}${final_value(value)}${percent_nedded}`
		]);
	});
});

Schema.setFieldSettings("DistributorSalesTable", {
	["Sales"]: {
		maskOptions: {
			mask: Number,
			thousandsSeparator: " "
		}
	},
	["SortOrder"]: {
		maskOptions: {
			mask: Number
		}
	}
});

Schema.setFieldSettings("BrandSalesTable", {
	["Sales"]: {
		maskOptions: {
			mask: Number,
			thousandsSeparator: " "
		}
	},
	["SortOrder"]: {
		maskOptions: {
			mask: Number
		}
	}
});
