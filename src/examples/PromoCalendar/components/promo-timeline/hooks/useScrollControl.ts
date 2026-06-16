import { useCallback, useLayoutEffect, useRef } from "react";
import type { RefObject } from "react";
import { usePanelStore } from "../../management-panel/store/panel.store";
import { MS_DAY } from "../utils/constants";
import { todayUTCms } from "../utils/date";
import type { TimelineModel } from "../utils/timeline";

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

/**
 * Управление горизонтальным скроллом таймлайна (нативный скролл-контейнер).
 *  - старт/смена периода: скролл к текущему дню, если он в периоде;
 *  - кнопка «Сегодня» (флаг showToday): то же по требованию;
 *  - смена масштаба (dayWidth, пресеты): держим день в центре вьюпорта стабильным.
 * Видимая область таймлайна — правее sticky-сайдбара (ширина leftW; 0 без группировки).
 */
export function useScrollControl({
	scrollRef,
	timeline,
	dayWidth,
	leftW
}: {
	scrollRef: RefObject<HTMLElement | null>;
	timeline: TimelineModel;
	dayWidth: number;
	leftW: number;
}) {
	const showToday = usePanelStore((s) => s.showToday);
	const resetShowToday = usePanelStore((s) => s.resetShowToday);
	const prevDayWidthRef = useRef<number | null>(null);

	const startMs = timeline.startMs;

	// Центрировать день `ms` в видимой области таймлайна.
	// smooth=true — анимированный скролл (кнопка «Сегодня»); по умолчанию мгновенно.
	const scrollToMs = useCallback(
		(ms: number, smooth = false) => {
			const el = scrollRef.current;
			if (!el) return;
			const contentX = ((ms - startMs) / MS_DAY) * dayWidth;
			const target = leftW + contentX - (el.clientWidth + leftW) / 2;
			el.scrollTo({ left: clamp(target, 0, el.scrollWidth - el.clientWidth), behavior: smooth ? "smooth" : "auto" });
		},
		[scrollRef, startMs, dayWidth, leftW]
	);

	// Старт и смена периода: к сегодня (если в периоде), иначе к началу.
	useLayoutEffect(() => {
		const today = todayUTCms();
		const el = scrollRef.current;
		if (el) el.scrollLeft = 0;
		if (today >= timeline.startMs && today < timeline.endMs) scrollToMs(today);
		prevDayWidthRef.current = dayWidth;
		// dayWidth/scrollToMs намеренно вне зависимостей: реагируем только на смену периода.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [timeline]);

	// Кнопка «Сегодня».
	useLayoutEffect(() => {
		if (!showToday) return;
		const today = todayUTCms();
		if (today >= timeline.startMs && today < timeline.endMs) scrollToMs(today, true);
		resetShowToday();
	}, [showToday, timeline.startMs, timeline.endMs, scrollToMs, resetShowToday]);

	// Смена масштаба (пресеты): пересчёт scrollLeft, чтобы центр вьюпорта (день) не «прыгал».
	useLayoutEffect(() => {
		const prev = prevDayWidthRef.current;
		prevDayWidthRef.current = dayWidth;
		if (prev === null || prev === dayWidth) return;

		const el = scrollRef.current;
		if (!el) return;
		const half = (el.clientWidth - leftW) / 2;
		const centerMs = startMs + ((el.scrollLeft + half) / prev) * MS_DAY;
		const nextContentX = ((centerMs - startMs) / MS_DAY) * dayWidth;
		const target = leftW + nextContentX - (el.clientWidth + leftW) / 2;
		el.scrollLeft = clamp(target, 0, el.scrollWidth - el.clientWidth);
	}, [scrollRef, dayWidth, startMs, leftW]);
}
