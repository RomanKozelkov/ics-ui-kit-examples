import type { PromoData } from "../../api/promo.queries";

export type GroupField = "channelType" | "companyName" | "brandName";

export const GROUP_FIELD_LABEL: Record<GroupField, string> = {
	channelType: "Канал",
	companyName: "Клиент",
	brandName: "Бренд"
};

export type PromoItem = PromoData;

export type PreparedPromoItem = PromoItem & {
	color: string;
	startMs: number;
	endMs: number;
	durationDays: number;
};
