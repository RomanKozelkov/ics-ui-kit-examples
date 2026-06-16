import { useQuery } from "@tanstack/react-query";
import { usePromoCalendarContext } from "../PromoCalendarContext";
import { promoKeys } from "./promo.keys";

export function usePromoCalendarQuery({ dateBegin, dateEnd }: { dateBegin: string; dateEnd: string }) {
	const { api } = usePromoCalendarContext();
	return useQuery({
		queryKey: promoKeys.fetch({ dateBegin, dateEnd }),
		queryFn: () => api.fetchPromoCalendar(dateBegin, dateEnd),
		select: (data) =>
			data.map<PromoData>((item) => ({
				id: item.id,
				title: item.title,
				dateBegin: toIsoDate(item.dateBegin),
				dateEnd: toIsoDate(item.dateEnd),
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

	channelType: string;
	companyName: string;
	brandName: string;
	skuName: string;
}
