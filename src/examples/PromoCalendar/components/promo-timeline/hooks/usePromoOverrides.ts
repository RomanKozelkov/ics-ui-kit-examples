import { useCallback, useOptimistic, useTransition } from "react";
import { useChangePromoPeriodMutation } from "../../../api/promo.queries";
import type { PromoCalendarItem } from "../../../api/promo.types";
import { msToISO, exclusiveMsToInclusiveISO } from "../utils/date";

/**
 * Мост между таймлайном (мс, exclusive end) и API (ISO, inclusive end).
 *
 * Оптимистика живёт в useOptimistic (React-слой), кэш RQ — чистый источник правды.
 * applyPatch синхронно подменяет span на текущий кадр (без подёргивания от батчинга RQ),
 * а на конце transition оптимистичное значение растворяется в реальные данные — к этому
 * моменту onSuccess мутации уже записал подтверждённый span в кэш (см. promo.queries.ts).
 * На ошибке useOptimistic откатывает UI сам, ручной prev не нужен.
 */
export function usePromoOverrides(data: PromoCalendarItem[] | undefined, year: number) {
	const { mutateAsync } = useChangePromoPeriodMutation({ year });
	const [, startTransition] = useTransition();

	const [items, applyPatch] = useOptimistic(data ?? [], (current: PromoCalendarItem[], updated: PromoCalendarItem) =>
		current.map((p) => (p.id === updated.id ? updated : p))
	);

	const onPeriodChange = useCallback(
		(id: string, startMs: number, endMs: number) => {
			// changePromoPeriod слит с updatePromo — backend принимает целый promo,
			// поэтому собираем полный item из data, меняя только период.
			const target = data?.find((p) => p.id === Number(id));
			if (!target) return;
			const updated: PromoCalendarItem = {
				...target,
				dateBegin: msToISO(startMs),
				dateEnd: exclusiveMsToInclusiveISO(endMs)
			};
			// applyPatch обязан идти внутри transition — иначе React 19 кинет варн
			// "optimistic update outside a transition". await держит transition открытым,
			// пока мутация не сядет → useOptimistic удерживает бар до записи в кэш (onSuccess).
			// try/catch гасит reject mutateAsync (иначе unhandled rejection); откат UI делает
			// сам useOptimistic, инвалидацию — onError мутации.
			startTransition(async () => {
				applyPatch(updated);
				try {
					await mutateAsync(updated);
				} catch {
					// проглочено намеренно: откат и инвалидация уже обработаны выше по стеку
				}
			});
		},
		[data, applyPatch, mutateAsync]
	);

	return { items, onPeriodChange };
}
