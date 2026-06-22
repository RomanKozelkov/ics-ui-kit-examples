import type { PromoCalendarItem } from "../../api/promo.types";
import type { TextKey } from "../../i18n";
import type { PromoColor } from "./utils/palette";

export type GroupField = "channelName" | "companyName";

/** Поле группировки → ключ перевода названия поля. */
export const GROUP_FIELD_TEXT_KEY: Record<GroupField, TextKey> = {
	channelName: "groupField.channel",
	companyName: "groupField.client"
};

export type PromoItem = PromoCalendarItem;

export type PreparedPromoItem = PromoItem & {
	color: PromoColor;
	startMs: number;
	endMs: number;
	durationDays: number;
};
