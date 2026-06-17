import { useMemo } from "react";
import type { PreparedPromoItem, PromoItem } from "../types";
import { colorForId } from "../utils/palette";
import { isoToMsUTC, daysBetween, inclusiveEndToExclusiveMs } from "../utils/date";

/** Обогащает сырые промо вычисляемыми полями: цвет, границы в ms, длительность. */
export function usePreparedItems(items: PromoItem[]): PreparedPromoItem[] {
	return useMemo(
		() =>
			items.map((item) => {
				const startMs = isoToMsUTC(item.dateBegin);
				const endMs = inclusiveEndToExclusiveMs(item.dateEnd);
				return {
					...item,
					color: colorForId(item.id),
					startMs,
					endMs,
					durationDays: daysBetween(startMs, endMs)
				};
			}),
		[items]
	);
}
