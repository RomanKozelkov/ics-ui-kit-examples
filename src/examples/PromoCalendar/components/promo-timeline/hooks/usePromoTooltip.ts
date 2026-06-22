import { type PointerEvent, useCallback, useEffect, useRef } from "react";
import { usePromoTooltipStore } from "../store/promoTooltip.store";
import type { PreparedPromoItem } from "../types";
const TOOLTIP_HOVER_DELAY_MS = 300;

/**
 * Hover-таймер одного бара поверх общего стора тултипа (PromoHoverTooltip): пишем императивно
 * через getState(), бар не ререндерится. Задержка как у Radix — без мигания при свайпе курсором
 * по барам. Таймер снимается на pointer-leave/down и на анмаунте (скролл/смена данных удаляют бары).
 */
export function usePromoTooltip(item: PreparedPromoItem) {
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const clearTimer = useCallback(() => {
		if (timerRef.current) clearTimeout(timerRef.current);
		timerRef.current = null;
	}, []);

	const showTooltip = useCallback(
		(e: PointerEvent<HTMLDivElement>) => {
			// buttons!==0 → идёт жест (drag/resize), не hover.
			if (e.buttons !== 0) return;
			const x = e.clientX;
			const y = e.currentTarget.getBoundingClientRect().top;
			clearTimer();
			timerRef.current = setTimeout(() => usePromoTooltipStore.getState().show({ item, x, y }), TOOLTIP_HOVER_DELAY_MS);
		},
		[item, clearTimer]
	);

	const hideTooltip = useCallback(() => {
		clearTimer();
		usePromoTooltipStore.getState().hide();
	}, [clearTimer]);

	useEffect(() => clearTimer, [clearTimer]);

	return { showTooltip, hideTooltip };
}
