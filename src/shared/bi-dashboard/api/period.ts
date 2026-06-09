import type { TabularFilter } from "../../api";
import { column, SCHEMA } from "./schema";

/** Период анализа: FY — полный год, YTD/QTD/MTD — с начала года/квартала/месяца по сегодня. */
export type Period = "FY" | "YTD" | "QTD" | "MTD";

/** Диапазон дат в формате YYYYMMDD (включительно). */
export type PeriodRange = { startId: number; endId: number };

/** Date → число YYYYMMDD (формат ID календаря). */
function yyyymmdd(d: Date): number {
	const m = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	return Number(`${d.getFullYear()}${m}${day}`);
}

/**
 * Диапазоны дат текущего и прошлого года для периода (для сравнения YoY).
 * Конец диапазона — сегодняшнее число; начало зависит от периода.
 * Для `FY` возвращает `null` — фильтровать по датам не нужно (берётся весь год).
 */
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

/** Разворачивает диапазон в список ID всех дней внутри (включительно). */
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

const CALENDAR_ID = column(SCHEMA.calendar, "id").column;

/**
 * Фильтр периода для tabular-запроса: `in` по ID всех дней диапазонов.
 *
 * Бэкенд не принимает диапазонный `or(and(ge, le))`, поэтому дни материализуются в список ID.
 * Для `FY` возвращает `null` — период не ограничивается.
 */
export function buildPeriodFilter(year: number, period: Period): TabularFilter | null {
	const ranges = generatePeriodRanges(year, period);
	if (!ranges) return null;
	return { op: "in", column: { ...CALENDAR_ID }, list: ranges.flatMap(expandRangeToIds) };
}
