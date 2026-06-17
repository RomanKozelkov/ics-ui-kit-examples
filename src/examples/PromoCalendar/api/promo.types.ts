/**
 * Доменная модель промо — то, что отдаёт порт {@link PromoApi}.
 * Даты — ISO YYYY-MM-DD на всей границе: порт симметричен (и чтение, и запись в ISO),
 * потребителю не нужно помнить «где Date, где строка». Если у конкретного API сырое
 * представление дат другое, оно объявляется локально рядом со своим fetch и маппится
 * сюда (см. mock: RawPromo с Date → dateToIso).
 */
export interface PromoCalendarItem {
	id: number;
	title: string;
	dateBegin: string; // YYYY-MM-DD inclusive
	dateEnd: string; // YYYY-MM-DD inclusive
	channelType: string;
	companyName: string;
	companyId: number;
	channelId: number;
}
