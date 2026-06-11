import { useMemo } from "react";
import type { PromoData } from "../../../api/promo.queries";
import { getTimelineModel } from "../utils/timeline";
import { prepareItems } from "../utils/layout";

export function usePromoLayout(items: PromoData[], dateBegin: string, dateEnd: string, dayWidth: number) {
	const timeline = useMemo(() => getTimelineModel(dateBegin, dateEnd), [dateBegin, dateEnd]);

	const { prepared, laneCount } = useMemo(
		() => prepareItems(items, timeline.startNum, timeline.totalDays),
		[items, timeline]
	);

	const totalW = timeline.totalDays * dayWidth;

	return { timeline, prepared, laneCount, totalW };
}
