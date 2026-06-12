import { useQuery } from "@tanstack/react-query";
import { mockFetchPromoCalendar } from "./promo.api";
import { promoKeys } from "./promo.keys";

export function usePromoCalendarQuery({ dateBegin, dateEnd }: { dateBegin: string; dateEnd: string }) {
	return useQuery({
		queryKey: promoKeys.fetch(),
		queryFn: () => mockFetchPromoCalendar(dateBegin, dateEnd),
		select: (data) =>
			data.map<PromoData>((item) => ({
				id: item.id,
				title: item.title,
				dateBegin: toIsoDate(item.dateBegin),
				dateEnd: toIsoDate(item.dateEnd),
				durationDays: Math.round((item.dateEnd.getTime() - item.dateBegin.getTime()) / 86400000) + 1,
				channelType: item.channelType,
				companyName: item.companyName,
				brandName: item.brandName,
				skuName: item.skuName
			}))
	});
}

function toIsoDate(date: Date): string {
	return date.toISOString().split("T")[0];
}

export interface PromoDto {
	id: number;
	title: string;
	dateBegin: Date;
	dateEnd: Date;
	channelType: string;
	companyName: string;
	brandName: string;
	skuName: string;
}

export interface PromoData {
	id: number;
	title: string;
	dateBegin: string; // YYYY-MM-DD
	dateEnd: string; // YYYY-MM-DD

	durationDays: number;
	channelType: string;
	companyName: string;
	brandName: string;
	skuName: string;
}
