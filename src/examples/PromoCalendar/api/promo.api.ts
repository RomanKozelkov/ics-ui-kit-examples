import { PromoCalendarItem } from "./promo.types";

export interface IPromoCalendarApi {
	fetchPromoCalendar(year: number): Promise<PromoCalendarItem[]>;
	fetchYears(): Promise<number[]>;
	getHolidays(year: number): Promise<Set<string>>; // в формате YYYY-MM-DD
	deletePromo(promoId: number): Promise<void>;
	createPromo(promo: Omit<PromoCalendarItem, "id">): Promise<void>;
	updatePromo(promo: PromoCalendarItem): Promise<void>;
}
