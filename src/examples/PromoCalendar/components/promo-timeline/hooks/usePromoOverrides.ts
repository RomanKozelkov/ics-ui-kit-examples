import { useCallback, useOptimistic, useTransition } from "react";
import { useChangePromoPeriodMutation } from "../../../api/promo.queries";
import type { PromoCalendarItem } from "../../../api/promo.types";
import { msToISO, exclusiveMsToInclusiveISO } from "../utils/date";

interface PromoPatch {
	promoId: number;
	dateBegin: string; // ISO inclusive YYYY-MM-DD
	dateEnd: string; // ISO inclusive YYYY-MM-DD
}

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

	const [items, applyPatch] = useOptimistic(
		data ?? [],
		(current: PromoCalendarItem[], patch: PromoPatch) =>
			current.map((p) =>
				p.id === patch.promoId ? { ...p, dateBegin: patch.dateBegin, dateEnd: patch.dateEnd } : p
			)
	);

	const onPeriodChange = useCallback(
		(id: string, startMs: number, endMs: number) => {
			const patch: PromoPatch = {
				promoId: Number(id),
				dateBegin: msToISO(startMs),
				dateEnd: exclusiveMsToInclusiveISO(endMs)
			};
			// applyPatch обязан идти внутри transition — иначе React 19 кинет варн
			// "optimistic update outside a transition". await держит transition открытым,
			// пока мутация не сядет → useOptimistic удерживает бар до записи span в кэш (onSuccess).
			// try/catch гасит reject mutateAsync (иначе unhandled rejection); откат UI делает
			// сам useOptimistic, инвалидацию — onError мутации.
			startTransition(async () => {
				applyPatch(patch);
				try {
					await mutateAsync(patch);
				} catch {
					// проглочено намеренно: откат и инвалидация уже обработаны выше по стеку
				}
			});
		},
		[applyPatch, mutateAsync]
	);

	// TODO: useTransition даёт isPending — можно диммить/дизейблить бар на время сейва.
	return { items, onPeriodChange };
}
