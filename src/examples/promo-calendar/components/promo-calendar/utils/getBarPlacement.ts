import { PromoData } from "../../../api/promo.queries";
import { dayNumFromISO } from "./date";
import { TimelineModel } from "./timeline";

export type PromoCalendarItem = {
	beginIdx: number;
	endIdx: number;
	overflowLeft: boolean;
	overflowRight: boolean;
	color: string;
};

export type BarPlacement = {
	startColumn: number; // 0-based индекс колонки (= dayIndex), клиппится по краям
	daysInTimeline: number; // количество входящих в диапазон дней, если промо пересекает диапазон общее количество дней в тиапазоне > реальное входящее видимое количество дней
	clippedStart: boolean; // промо началось левее окна
	clippedEnd: boolean; // промо кончилось правее окна
};

/**
 * Позиция полоски промо в сетке таймлайна.
 * Возвращает null, если промо целиком вне диапазона.
 */
export function getBarPlacement(promo: PromoData, timeline: TimelineModel): BarPlacement | null {
	const { startNum, totalDays } = timeline;
	const begin = dayNumFromISO(promo.dateBegin) - startNum;
	const end = dayNumFromISO(promo.dateEnd) - startNum;

	if (end < 0 || begin > totalDays - 1) return null; // не пересекается с окном

	const startColumn = Math.max(begin, 0);
	const endColumn = Math.min(end, totalDays - 1);

	return {
		startColumn,
		daysInTimeline: endColumn - startColumn + 1,
		clippedStart: begin < 0,
		clippedEnd: end > totalDays - 1
	};
}
