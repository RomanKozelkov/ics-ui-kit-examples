import type { TabularColumnRef, TabularRawRow } from "../../api";
import type { Metric } from "../format";

/**
 * Как достать значение поля из строки ответа:
 *  - строка — ключ в записи ответа (`row["Calendar[Year]"]`), типичный tabular-случай;
 *  - функция — кастомное извлечение (навигация по вложенным объектам rawFetch с `$`/`/`).
 * Отсутствует — поле только для запроса (фильтр/сортировка), в ответе не читается.
 */
export type FieldAccess = string | ((row: TabularRawRow) => unknown);

/** Поле объекта: имя колонки для запроса (`name`) и опциональный доступ к ответу (`get`). */
export type Field = {
	name: string;
	get?: FieldAccess;
};

/** Объект API (таблица) и его поля. Единая форма и для tabular, и для rawFetch. */
export type ObjectSchema = {
	table: string;
	fields: Record<string, Field>;
};

/** Колонка `{table, name}` для tabular `select`/фильтра — по объекту и имени его поля. */
export const column = (obj: ObjectSchema, field: string): TabularColumnRef => ({
	column: { table: obj.table, name: obj.fields[field].name }
});

/** Значение поля из строки ответа: по ключу-строке либо через функцию-аксессор. */
export const read = (field: Field, row: TabularRawRow): unknown => {
	if (field.get === undefined) throw new Error(`Field "${field.name}" не читается из ответа (нет get)`);
	return typeof field.get === "string" ? row[field.get] : field.get(row);
};

/** Строковый ключ ответа поля — для tabular-полей, у которых `get` задан строкой. */
export const keyOf = (field: Field): string => {
	if (typeof field.get !== "string") throw new Error(`Field "${field.name}" не имеет строкового ключа ответа`);
	return field.get;
};

/** Поле меры под выбранную метрику — по конвенции ключей `unit`/`usd`/`rub`. */
export const metricField = (obj: ObjectSchema, metric: Metric): Field =>
	obj.fields[metric === "Units" ? "unit" : metric === "USD" ? "usd" : "rub"];

/** Колонка меры под метрику — для tabular `select`. */
export const metricColumn = (obj: ObjectSchema, metric: Metric): TabularColumnRef =>
	column(obj, metric === "Units" ? "unit" : metric === "USD" ? "usd" : "rub");

/**
 * Схема API: один инстанс, одни объекты типизации для всех дашбордов. Поля сгруппированы
 * под своим объектом — таблица не повторяется, связь «объект ↔ его поля» явная.
 *
 * `get` хранит способ чтения ответа рядом с полем:
 *  - tabular-поля: строка-ключ (бэкенд для измерений даёт префикс таблицы `Calendar[Year]`,
 *    для мер — нет `[Offtake, unit]`, поэтому ключ задаётся явно);
 *  - rawFetch directCompany: функция-навигация по `$`-объектам ответа.
 */
export const SCHEMA = {
	calendar: {
		table: "Calendar~Tabular",
		fields: {
			year: { name: "Year", get: "Calendar[Year]" },
			month: { name: "Month", get: "Calendar[Month]" },
			id: { name: "ID" }
		}
	},
	client: {
		table: "Client~Tabular",
		fields: {
			client: { name: "Client", get: "Client[Client]" }
		}
	},
	product: {
		table: "Product~Tabular",
		fields: {
			brand: { name: "Product Brand", get: "Product[Product Brand]" }
		}
	},
	clientLocation: {
		table: "Client Location~Tabular",
		fields: {
			region: { name: "Client Location Region FIAS", get: "Client Location[Client Location Region FIAS]" }
		}
	},
	sourceType: {
		table: "Source Type~Tabular",
		fields: { sourceType: { name: "Source Type" } }
	},
	bindType: {
		table: "Bind Type~Tabular",
		fields: { bindType: { name: "Bind Type" } }
	},
	clientContract: {
		table: "Client Contract~Tabular",
		fields: { isContracted: { name: "Client is Contracted" } }
	},
	clientEcom: {
		table: "Client Ecom Typed Filter~Tabular",
		fields: { filter: { name: "Filter" } }
	},
	primarySales: {
		table: "Primary Sales~Tabular",
		fields: {
			unit: { name: "Primary Sales, unit", get: "[Primary Sales, unit]" },
			usd: { name: "Primary Sales, USD conversion", get: "[Primary Sales, USD conversion]" },
			rub: { name: "Primary Sales, INV RUB", get: "[Primary Sales, INV RUB]" }
		}
	},
	secondarySales: {
		table: "Secondary Sales~Tabular",
		fields: {
			unit: { name: "Secondary Sales, unit", get: "[Secondary Sales, unit]" },
			usd: { name: "Secondary Sales, USD conversion", get: "[Secondary Sales, USD conversion]" },
			rub: { name: "Secondary Sales, INV RUB", get: "[Secondary Sales, INV RUB]" }
		}
	},
	offtake: {
		table: "Offtake~Tabular",
		fields: {
			unit: { name: "Offtake, unit", get: "[Offtake, unit]" },
			usd: { name: "Offtake, USD conversion", get: "[Offtake, USD conversion]" },
			rub: { name: "Offtake, INV RUB", get: "[Offtake, INV RUB]" }
		}
	},
	/** Источник списка дистрибьюторов для Primary Sales (rawFetch) — навигация к названию компании. */
	directCompany: {
		table: "md.DirectCompany",
		fields: {
			name: {
				name: "ID_Company/vw_Company_AdditionalInfo_o2o/Name",
				get: (row) => (row as any).ID_Company$?.vw_Company_AdditionalInfo_o2o$?.Name
			}
		}
	}
} as const satisfies Record<string, ObjectSchema>;
