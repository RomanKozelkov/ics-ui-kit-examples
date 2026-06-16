import { useMemo } from "react";
import type { GroupField, PreparedPromoItem, PromoItem } from "../types";
import { colorForIndex } from "../utils/palette";
import { isoToMsUTC, daysBetween } from "../utils/date";
import { buildGroupTree, type GroupNode } from "../utils/grouping";

export function useGroupedRows(items: PromoItem[], groupBy: GroupField[]): GroupNode[] {
	return useMemo(() => {
		const prepared: PreparedPromoItem[] = items.map((item, i) => {
			const startMs = isoToMsUTC(item.dateBegin);
			const endMs = isoToMsUTC(item.dateEnd) + 86_400_000;
			return {
				...item,
				color: colorForIndex(i),
				startMs,
				endMs,
				durationDays: daysBetween(startMs, endMs)
			};
		});
		return buildGroupTree(prepared, groupBy);
	}, [items, groupBy]);
}
