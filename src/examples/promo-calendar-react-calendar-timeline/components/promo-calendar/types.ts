import type { PromoData } from "../../api/promo.queries";

export type GroupField = "channelType" | "companyName" | "brandName";

export const GROUP_FIELD_LABEL: Record<GroupField, string> = {
	channelType: "Канал",
	companyName: "Клиент",
	brandName: "Бренд"
};

export type PromoItem = PromoData;

// Запись промо, подготовленная для react-calendar-timeline.
export type TimelineItem = {
	id: number;
	group: string;
	title: string;
	start_time: number;
	end_time: number;
	// Кастомные поля — пробрасываются в itemRenderer.
	color: string;
	durationDays: number;
	overflowLeft: boolean;
	overflowRight: boolean;
	brandName: string;
	channelType: string;
	skuName: string;
};

// Группа-строка для react-calendar-timeline.
export type TimelineGroup = {
	id: string;
	title: string;
	count: number;
	collapsible: boolean;
	collapsed: boolean;
	height?: number;
	stackItems?: boolean;
};
