import { useCallback, useLayoutEffect, useRef } from "react";
import type { RefObject } from "react";
import { useTimelineContext } from "dnd-timeline";
import { MS_DAY } from "../utils/constants";
import { todayUTCms } from "../utils/date";
import type { TimelineModel } from "../utils/timeline";

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

/**
 * Управление горизонтальным скроллом таймлайна (нативный скролл-контейнер).
 *  - старт/смена периода: скролл к текущему дню, если он в периоде;
 *  - кнопка «Сегодня» (флаг showToday): то же по требованию;
 *  - смена масштаба (dayWidth, пресеты): держим день в центре вьюпорта стабильным.
 * Видимая область таймлайна — правее sticky-сайдбара (ширина sidebarWidth; 0 без группировки).
 *
 * `showToday`/`onTodayConsumed` приходят параметрами: хук не знает про конкретный стор —
 * любой источник триггера подойдёт (тест, другой стор), потребитель сам решает, чем сбросить флаг.
 */
export function useScrollControl({
	scrollRef,
	timeline,
	dayWidth,
	showToday,
	onTodayConsumed
}: {
	scrollRef: RefObject<HTMLElement | null>;
	timeline: TimelineModel;
	dayWidth: number;
	/** Триггер прокрутки к сегодня (кнопка «Сегодня»). */
	showToday: boolean;
	/** Вызывается после обработки showToday — потребитель гасит флаг. */
	onTodayConsumed: () => void;
}) {
	const { sidebarWidth } = useTimelineContext();
	const prevDayWidthRef = useRef<number | null>(null);

	const startMs = timeline.startMs;

	// scrollLeft, при котором день `ms` оказывается в центре видимой области (правее сайдбара).
	const centerTargetPx = useCallback(
		(ms: number, el: HTMLElement) => {
			const contentX = ((ms - startMs) / MS_DAY) * dayWidth;
			return sidebarWidth + contentX - (el.clientWidth + sidebarWidth) / 2;
		},
		[startMs, dayWidth, sidebarWidth]
	);

	// Центрировать день `ms` в видимой области таймлайна.
	// smooth=true — анимированный скролл (кнопка «Сегодня»); по умолчанию мгновенно.
	const scrollToMs = useCallback(
		(ms: number, smooth = false) => {
			const el = scrollRef.current;
			if (!el) return;
			const target = centerTargetPx(ms, el);
			el.scrollTo({ left: clamp(target, 0, el.scrollWidth - el.clientWidth), behavior: smooth ? "smooth" : "auto" });
		},
		[scrollRef, centerTargetPx]
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
		onTodayConsumed();
	}, [showToday, timeline.startMs, timeline.endMs, scrollToMs, onTodayConsumed]);

	// Смена масштаба (пресеты): пересчёт scrollLeft, чтобы центр вьюпорта (день) не «прыгал».
	useLayoutEffect(() => {
		const prev = prevDayWidthRef.current;
		prevDayWidthRef.current = dayWidth;
		if (prev === null || prev === dayWidth) return;

		const el = scrollRef.current;
		if (!el) return;
		// Какой день сейчас в центре (по старому масштабу prev) — его и держим после смены масштаба.
		const half = (el.clientWidth - sidebarWidth) / 2;
		const centerMs = startMs + ((el.scrollLeft + half) / prev) * MS_DAY;
		el.scrollLeft = clamp(centerTargetPx(centerMs, el), 0, el.scrollWidth - el.clientWidth);
	}, [scrollRef, dayWidth, startMs, sidebarWidth, centerTargetPx]);
}
