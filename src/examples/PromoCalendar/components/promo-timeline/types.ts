import type { PromoData } from "../../api/promo.queries";
import type { TextKey } from "../../i18n";

export type GroupField = "channelType" | "companyName" | "brandName";

/** Поле группировки → ключ перевода названия поля. */
export const GROUP_FIELD_TEXT_KEY: Record<GroupField, TextKey> = {
	channelType: "groupField.channel",
	companyName: "groupField.client",
	brandName: "groupField.brand"
};

export type PromoItem = PromoData;

export type PreparedPromoItem = PromoItem & {
	color: string;
	startMs: number;
	endMs: number;
	durationDays: number;
};
