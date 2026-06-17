import { useQuery } from "@tanstack/react-query";
import { usePromoCalendarContext } from "../PromoCalendarContext";
import { promoKeys } from "./promo.keys";
import { dateToIso } from "../utils/dateToIso";

export function useYearsQuery() {
	const { api } = usePromoCalendarContext();
	return useQuery({
		queryKey: promoKeys.years(),
		queryFn: () => api.fetchYears()
	});
}

export function useHolidaysQuery({ year }: { year: number }) {
	const { api } = usePromoCalendarContext();
	return useQuery({
		queryKey: promoKeys.holidays(year),
		queryFn: () => api.getHolidays(year),
		select: (dates) => new Set(dates)
	});
}

export function usePromoCalendarQuery({ year }: { year: number }) {
	const { api } = usePromoCalendarContext();
	return useQuery({
		queryKey: promoKeys.fetch(year),
		queryFn: () => api.fetchPromoCalendar(year),
		select: (data) =>
			data.map<PromoData>((item) => ({
				id: item.id,
				title: item.title,
				dateBegin: dateToIso(item.dateBegin),
				dateEnd: dateToIso(item.dateEnd),
				channelType: item.channelType,
				companyName: item.companyName,
				companyId: item.companyId,
				channelId: item.channelId
			}))
	});
}

export interface PromoDto {
	id: number;
	title: string;
	dateBegin: Date;
	dateEnd: Date;
	channelType: string;
	channelId: number;
	companyName: string;
	companyId: number;
}

export interface PromoData {
	id: number;
	title: string;
	dateBegin: string; // YYYY-MM-DD
	dateEnd: string; // YYYY-MM-DD

	channelType: string;
	companyName: string;
	companyId: number;
	channelId: number;
}
