import { PromoCalendarItem } from "./promo.types";

export interface PromoApi {
	fetchPromoCalendar(year: number): Promise<PromoCalendarItem[]>;
	fetchYears(): Promise<number[]>;
	getHolidays(year: number): Promise<Set<string>>; // в формате YYYY-MM-DD
	changePromoPeriod(promoId: number, dateBegin: string, dateEnd: string): Promise<void>;
	deletePromo(promoId: number): Promise<void>;
	createPromo(promo: Omit<PromoCalendarItem, "id">): Promise<void>;
}
