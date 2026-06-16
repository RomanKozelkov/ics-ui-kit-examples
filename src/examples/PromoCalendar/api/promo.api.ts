import { PromoCalendarItem } from "./promo.types";
import { getStaticPromos } from "./promo.mock";
import { PromoDto } from "./promo.queries";

/**
 * Источник данных промо-календаря. Инъектится через PromoCalendarContext.
 * Локалка/showcase — mockPromoApi, прод — реальная реализация, тесты — стаб.
 */
export interface PromoApi {
	fetchPromoCalendar(dateBegin: string, dateEnd: string): Promise<PromoDto[]>;
}

export const mockPromoApi: PromoApi = {
	fetchPromoCalendar: mockFetchPromoCalendar
};

export function mockFetchPromoCalendar(dateBegin: string, dateEnd: string): Promise<PromoDto[]> {
	const beginMs = new Date(dateBegin).getTime();
	const endMs = new Date(dateEnd).getTime();

	const result = getStaticPromos()
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
