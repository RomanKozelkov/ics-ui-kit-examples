import { PromoApi } from "../promo.api";
import { getStaticWithCache } from "./mock.data";
import { PromoDto } from "../promo.queries";
import { PromoCalendarItem } from "../promo.types";

export const mockPromoApi: PromoApi = {
	fetchPromoCalendar: mockFetchPromoCalendar,
	fetchYears: mockFetchYears,
	getHolidays: mockGetHolidays,
	changePromoPeriod: () => Promise.resolve(),
	deletePromo: () => Promise.resolve(),
	createPromo: () => Promise.resolve()
};

function mockFetchYears(): Promise<number[]> {
	return Promise.resolve([2024, 2025, 2026]);
}
const RU_HOLIDAY_PATTERNS = [
	"01-01",
	"01-02",
	"01-03",
	"01-04",
	"01-05",
	"01-06",
	"01-07",
	"01-08",
	"02-23",
	"03-08",
	"05-01",
	"05-09",
	"06-12",
	"11-04"
];

function mockGetHolidays(year: number): Promise<Set<string>> {
	const fixed = RU_HOLIDAY_PATTERNS.map((md) => `${year}-${md}`);

	const weekends = new Set<string>([...fixed]);
	const d = new Date(Date.UTC(year, 0, 1));
	while (d.getUTCFullYear() === year) {
		const dow = d.getUTCDay();
		if (dow === 0 || dow === 6) {
			weekends.add(d.toISOString().split("T")[0]);
		}
		d.setUTCDate(d.getUTCDate() + 1);
	}

	return Promise.resolve(weekends);
}

function mockFetchPromoCalendar(year: number): Promise<PromoDto[]> {
	const beginMs = new Date(year, 0, 1).getTime();
	const endMs = new Date(year + 1, 0, 1).getTime() - 1;

	const result = getStaticWithCache()
		.filter((item) => item.dateBegin.getTime() <= endMs && item.dateEnd.getTime() >= beginMs)
		.map((item) => clampToRange(item, beginMs, endMs));

	return Promise.resolve(result);
}
function clampToRange(item: PromoCalendarItem, beginMs: number, endMs: number): PromoCalendarItem {
	return {
		...item,
		dateBegin: new Date(Math.max(item.dateBegin.getTime(), beginMs)),
		dateEnd: new Date(Math.min(item.dateEnd.getTime(), endMs))
	};
}
