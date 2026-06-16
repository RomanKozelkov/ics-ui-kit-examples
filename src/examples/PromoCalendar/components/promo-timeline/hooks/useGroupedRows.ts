import { useMemo } from "react";
import type { GroupField, PreparedPromoItem, PromoItem } from "../types";
import { colorForIndex } from "../utils/palette";
import { isoToMsUTC, daysBetween } from "../utils/date";
import { MS_DAY } from "../utils/constants";
import { buildGroupTree, type GroupNode } from "../utils/grouping";
import { useText } from "../../../i18n";

export function useGroupedRows(items: PromoItem[], groupBy: GroupField[]): GroupNode[] {
	const text = useText();
	return useMemo(() => {
		const prepared: PreparedPromoItem[] = items.map((item, i) => {
			const startMs = isoToMsUTC(item.dateBegin);
			const endMs = isoToMsUTC(item.dateEnd) + MS_DAY;
			return {
				...item,
				color: colorForIndex(i),
				startMs,
				endMs,
				durationDays: daysBetween(startMs, endMs)
			};
		});
		return buildGroupTree(prepared, groupBy, text("calendar.allPromos"));
	}, [items, groupBy, text]);
}
