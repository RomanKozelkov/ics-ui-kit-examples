import type { PromoCalendarItem } from "../../api/promo.types";
import type { TextKey } from "../../i18n";

export type GroupField = "channelType" | "companyName";

/** Поле группировки → ключ перевода названия поля. */
export const GROUP_FIELD_TEXT_KEY: Record<GroupField, TextKey> = {
	channelType: "groupField.channel",
	companyName: "groupField.client"
};

export type PromoItem = PromoCalendarItem;

export type PreparedPromoItem = PromoItem & {
	color: string;
	startMs: number;
	endMs: number;
	durationDays: number;
};
