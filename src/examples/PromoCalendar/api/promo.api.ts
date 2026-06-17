import { PromoDto } from "./promo.queries";

export interface PromoApi {
	fetchPromoCalendar(year: number): Promise<PromoDto[]>;
	fetchYears(): Promise<number[]>;
	getHolidays(year: number): Promise<Set<string>>; // в формате YYYY-MM-DD
	changePromoPeriod(promoId: number, dateBegin: string, dateEnd: string): Promise<void>;
	deletePromo(promoId: number): Promise<void>;
	createPromo(promo: Omit<PromoDto, "id">): Promise<void>;
}
