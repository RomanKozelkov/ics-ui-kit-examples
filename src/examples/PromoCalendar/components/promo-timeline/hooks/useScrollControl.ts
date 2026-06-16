import { useCallback, useLayoutEffect, useRef } from "react";
import type { RefObject } from "react";
import { usePanelStore } from "../../management-panel/store/panel.store";
import { LEFT_W, MS_DAY } from "../utils/constants";
import { todayUTCms } from "../utils/date";
import type { TimelineModel } from "../utils/timeline";

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

/**
 * Управление горизонтальным скроллом таймлайна (нативный скролл-контейнер).
 *  - старт/смена периода: скролл к текущему дню, если он в периоде;
 *  - кнопка «Сегодня» (флаг showToday): то же по требованию;
 *  - смена масштаба (dayWidth): держим день в центре вьюпорта стабильным.
 * Видимая область таймлайна — правее sticky-сайдбара (ширина LEFT_W).
 */
export function useScrollControl({
	scrollRef,
	timeline,
	dayWidth
}: {
	scrollRef: RefObject<HTMLElement | null>;
	timeline: TimelineModel;
	dayWidth: number;
}) {
	const showToday = usePanelStore((s) => s.showToday);
	const resetShowToday = usePanelStore((s) => s.resetShowToday);
	const prevDayWidthRef = useRef<number | null>(null);

	// Половина видимой области таймлайна (без учёта сайдбара).
	const halfViewport = (el: HTMLElement) => (el.clientWidth - LEFT_W) / 2;

	// ms → позиция дня по центру видимой области.
	const scrollToMs = useCallback(
		(ms: number) => {
			const el = scrollRef.current;
			if (!el) return;
			const contentX = ((ms - timeline.startMs) / MS_DAY) * dayWidth;
			const target = contentX - halfViewport(el);
			el.scrollLeft = clamp(target, 0, el.scrollWidth - el.clientWidth);
		},
		[scrollRef, timeline.startMs, dayWidth]
	);

	// Старт и смена периода: к сегодня (если в периоде), иначе к началу.
	useLayoutEffect(() => {
		const today = todayUTCms();
		const inPeriod = today >= timeline.startMs && today < timeline.endMs;
		const el = scrollRef.current;
		if (el) el.scrollLeft = 0;
		if (inPeriod) scrollToMs(today);
		prevDayWidthRef.current = dayWidth;
		// dayWidth/scrollToMs намеренно вне зависимостей: реагируем только на смену периода.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [timeline]);

	// Кнопка «Сегодня».
	useLayoutEffect(() => {
		if (!showToday) return;
		const today = todayUTCms();
		if (today >= timeline.startMs && today < timeline.endMs) scrollToMs(today);
		resetShowToday();
	}, [showToday, timeline.startMs, timeline.endMs, scrollToMs, resetShowToday]);

	// Смена масштаба: пересчёт scrollLeft, чтобы центр вьюпорта (день) не «прыгал».
	useLayoutEffect(() => {
		const prev = prevDayWidthRef.current;
		prevDayWidthRef.current = dayWidth;
		if (prev === null || prev === dayWidth) return;

		const el = scrollRef.current;
		if (!el) return;
		// Центр (в ms) по старой ширине, затем тот же центр по новой ширине.
		const centerContentX = el.scrollLeft + halfViewport(el);
		const centerMs = timeline.startMs + (centerContentX / prev) * MS_DAY;
		const nextContentX = ((centerMs - timeline.startMs) / MS_DAY) * dayWidth;
		const target = nextContentX - halfViewport(el);
		el.scrollLeft = clamp(target, 0, el.scrollWidth - el.clientWidth);
	}, [scrollRef, dayWidth, timeline.startMs]);
}
