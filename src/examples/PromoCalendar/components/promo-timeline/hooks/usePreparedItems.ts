import { useMemo, useRef } from "react";
import type { PreparedPromoItem, PromoItem } from "../types";
import { colorForId } from "../utils/palette";
import { isoToMsUTC, daysBetween, inclusiveEndToExclusiveMs } from "../utils/date";

function prepare(item: PromoItem): PreparedPromoItem {
	const startMs = isoToMsUTC(item.dateBegin);
	const endMs = inclusiveEndToExclusiveMs(item.dateEnd);
	return {
		...item,
		color: colorForId(item.id),
		startMs,
		endMs,
		durationDays: daysBetween(startMs, endMs)
	};
}

/**
 * Обогащает сырые промо вычисляемыми полями: цвет, границы в ms, длительность.
 *
 * Кеш по ссылке сырого объекта (WeakMap): неизменённые промо отдают тот же prepared между
 * рендерами. Оптимистика и RQ сохраняют ссылку у нетронутых промо (map с заменой одного по id),
 * поэтому на resize/drag/create меняется prepared только у затронутого → memo(PromoItem) скипает
 * остальных. WeakMap сам отпускает удалённые промо (GC), инвалидация не нужна.
 */
export function usePreparedItems(items: PromoItem[]): PreparedPromoItem[] {
	const cacheRef = useRef(new WeakMap<PromoItem, PreparedPromoItem>());

	return useMemo(() => {
		const cache = cacheRef.current;
		return items.map((item) => {
			const hit = cache.get(item);
			if (hit) return hit;
			const prepared = prepare(item);
			cache.set(item, prepared);
			return prepared;
		});
	}, [items]);
}
