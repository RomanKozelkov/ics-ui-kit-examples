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

// Обратная конвертация границы: доменный ISO → сырое Date-представление mock.
const toRaw = (id: number, promo: Omit<PromoCalendarItem, "id">): RawPromo => ({
	id,
	title: promo.title,
	dateBegin: new Date(promo.dateBegin),
	dateEnd: new Date(promo.dateEnd),
	channelType: promo.channelType,
	companyName: promo.companyName,
	companyId: promo.companyId,
	channelId: promo.channelId
});

const nextId = (items: RawPromo[]): number => items.reduce((max, p) => Math.max(max, p.id), 0) + 1;

export const mockPromoApi: PromoApi = {
	fetchPromoCalendar: async (year: number): Promise<PromoCalendarItem[]> => {
		const beginMs = new Date(year, 0, 1).getTime();
		const endMs = new Date(year + 1, 0, 1).getTime() - 1;

		const result = getStaticWithCache()
			.filter((item) => item.dateBegin.getTime() <= endMs && item.dateEnd.getTime() >= beginMs)
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
	deletePromo: async (promoId: number): Promise<void> => {
		const cache = getStaticWithCache();
		const idx = cache.findIndex((p) => p.id === promoId);
		if (idx !== -1) cache.splice(idx, 1);
		return Promise.resolve();
	},
	createPromo: async (promo: Omit<PromoCalendarItem, "id">): Promise<void> => {
		const cache = getStaticWithCache();
		cache.push(toRaw(nextId(cache), promo));
		return Promise.resolve();
	},
	updatePromo: async (promo: PromoCalendarItem): Promise<void> => {
		const cache = getStaticWithCache();
		const idx = cache.findIndex((p) => p.id === promo.id);
		if (idx !== -1) cache[idx] = toRaw(promo.id, promo);
		return Promise.resolve();
	}
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
