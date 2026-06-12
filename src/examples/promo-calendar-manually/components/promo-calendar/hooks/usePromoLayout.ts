import { useMemo } from "react";
import type { PromoData } from "../../../api/promo.queries";
import type { GroupField } from "../types";
import { getTimelineModel } from "../utils/timeline";
import { prepareItems } from "../utils/layout";
import { buildGroupTree } from "../utils/grouping";
import { DAY_NUMBER_MIN_PX } from "../utils/constants";
import { todayDayNum } from "../utils/date";

export function usePromoCalendar(
	items: PromoData[],
	dateBegin: string,
	dateEnd: string,
	dayWidth: number,
	groupBy: GroupField[]
) {
	const timeline = useMemo(() => getTimelineModel(dateBegin, dateEnd), [dateBegin, dateEnd]);

	const prepared = useMemo(
		() => prepareItems(items, timeline.startNum, timeline.totalDays),
		[items, timeline]
	);

	const groups = useMemo(() => buildGroupTree(prepared, groupBy), [prepared, groupBy]);

	const totalW = timeline.totalDays * dayWidth;
	const showDayNumbers = dayWidth >= DAY_NUMBER_MIN_PX;

	// Индекс колонки «сегодня», либо null если вне окна.
	const rawTodayIndex = todayDayNum() - timeline.startNum;
	const todayIndex = rawTodayIndex >= 0 && rawTodayIndex < timeline.totalDays ? rawTodayIndex : null;

	return { timeline, groups, totalW, showDayNumbers, todayIndex };
}
