import type { PromoData } from "../../api/promo.queries";

export type GroupField = "channelType" | "companyName" | "brandName";

export const GROUP_FIELD_LABEL: Record<GroupField, string> = {
	channelType: "Канал",
	companyName: "Клиент",
	brandName: "Бренд"
};

// Промо после раскладки на ось таймлайна: индексы колонок, флаги обрезки, цвет.
export type PreparedPromo = PromoData & {
	beginIdx: number; // колонка начала (может быть < 0, если началось левее окна)
	endIdx: number; // колонка конца, inclusive (может быть > totalDays-1)
	overflowLeft: boolean;
	overflowRight: boolean;
	color: string;
};
