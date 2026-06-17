import { PromoApi } from "../promo.api";
import { getStaticWithCache, type RawPromo } from "./mock.data";
import { PromoCalendarItem } from "../promo.types";
import { dateToIso } from "../../utils/dateToIso";

// Граница порта: сырое Date-представление mock → доменный ISO (см. promo.types).
const toIso = (item: RawPromo): PromoCalendarItem => ({
	id: item.id,
	title: item.title,
	dateBegin: dateToIso(item.dateBegin),
	dateEnd: dateToIso(item.dateEnd),
	channelType: item.channelType,
	companyName: item.companyName,
	companyId: item.companyId,
	channelId: item.channelId
});

export const mockPromoApi: PromoApi = {
	fetchPromoCalendar: async (year: number): Promise<PromoCalendarItem[]> => {
		const beginMs = new Date(year, 0, 1).getTime();
		const endMs = new Date(year + 1, 0, 1).getTime() - 1;

		const result = getStaticWithCache()
			.filter((item) => item.dateBegin.getTime() <= endMs && item.dateEnd.getTime() >= beginMs)
			.map((item) => clampToRange(item, beginMs, endMs))
			.map(toIso);

		return Promise.resolve(result);
	},
	fetchYears: async (): Promise<number[]> => {
		return Promise.resolve([2024, 2025, 2026]);
	},
	getHolidays: async (year: number): Promise<Set<string>> => {
		const fixed = RU_HOLIDAY_PATTERNS.map((md) => `${year}-${md}`);

		const daysOff = new Set<string>([...fixed]);
		const d = new Date(Date.UTC(year, 0, 1));
		while (d.getUTCFullYear() === year) {
			const dow = d.getUTCDay();
			if (dow === 0 || dow === 6) {
				daysOff.add(d.toISOString().split("T")[0]);
			}
			d.setUTCDate(d.getUTCDate() + 1);
		}

		return Promise.resolve(daysOff);
	},
	changePromoPeriod: async (promoId: number, dateBegin: string, dateEnd: string): Promise<void> => {
		const item = getStaticWithCache().find((p) => p.id === promoId);
		if (item) {
			item.dateBegin = new Date(dateBegin);
			item.dateEnd = new Date(dateEnd);
		}
		return Promise.resolve();
	},
	deletePromo: () => Promise.resolve(),
	createPromo: () => Promise.resolve()
};

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

function clampToRange(item: RawPromo, beginMs: number, endMs: number): RawPromo {
	return {
		...item,
		dateBegin: new Date(Math.max(item.dateBegin.getTime(), beginMs)),
		dateEnd: new Date(Math.min(item.dateEnd.getTime(), endMs))
	};
}
