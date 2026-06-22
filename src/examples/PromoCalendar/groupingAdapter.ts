import type { Grouping } from "./components/management-panel/store/panel.store";
import type { GroupField } from "./components/promo-timeline/types";

// Адаптер уровня фичи: связывает уровни группировки панели с полями группировки таймлайна,
// чтобы ни панель, ни таймлайн не знали о типах друг друга. Порядок = вложенность уровней.
const GROUPING_TO_FIELD: Record<Grouping, GroupField> = {
	channel: "channelName",
	client: "companyName"
};

export const mapGroupingToFields = (grouping: Grouping[]): GroupField[] => grouping.map((g) => GROUPING_TO_FIELD[g]);
