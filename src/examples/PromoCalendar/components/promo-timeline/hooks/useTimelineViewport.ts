import { useEffect, useMemo, useRef, useState } from "react";
import type { RefObject } from "react";

/** Видимое окно таймлайна в координатах контента (px от первого дня). */
export type TimelineViewport = {
	/** Левый край видимой области (= scrollLeft). */
	visibleStartX: number;
	/** Правый край видимой области (за вычетом sticky-сайдбара). */
	visibleEndX: number;
};

/**
 * Реактивно отслеживает горизонтальное видимое окно скролл-контейнера таймлайна.
 *
 * Возвращает окно в координатах КОНТЕНТА (origin = первый день), поэтому из правого
 * края вычитается `leftWidth` — ширина sticky-сайдбара, перекрывающего левую часть
 * вьюпорта. Так окно напрямую сравнимо с `toX(ms)` промо-баров.
 *
 * Слушает scroll (через rAF-throttle — programmatic scrollLeft тоже его триггерит) и
 * ResizeObserver контейнера; пере-измеряется при смене `dayWidth` (zoom меняет scrollLeft).
 */
export function useTimelineViewport({
	scrollRef,
	leftWidth,
	dayWidth
}: {
	scrollRef: RefObject<HTMLElement | null>;
	leftWidth: number;
	dayWidth: number;
}): TimelineViewport {
	const [metrics, setMetrics] = useState({ scrollLeft: 0, clientWidth: 0 });
	const rafRef = useRef<number | null>(null);

	useEffect(() => {
		const el = scrollRef.current;
		if (!el) return;

		const measure = () => setMetrics({ scrollLeft: el.scrollLeft, clientWidth: el.clientWidth });

		// rAF-throttle: scroll сыпется чаще кадра, измеряем максимум раз в кадр.
		const onScroll = () => {
			if (rafRef.current !== null) return;
			rafRef.current = requestAnimationFrame(() => {
				rafRef.current = null;
				measure();
			});
		};

		measure();
		el.addEventListener("scroll", onScroll, { passive: true });
		const ro = new ResizeObserver(measure);
		ro.observe(el);

		return () => {
			el.removeEventListener("scroll", onScroll);
			ro.disconnect();
			if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
			rafRef.current = null;
		};
		// dayWidth: смена масштаба двигает scrollLeft программно — пере-измеряем.
	}, [scrollRef, dayWidth]);

	return useMemo(
		() => ({
			visibleStartX: metrics.scrollLeft,
			visibleEndX: metrics.scrollLeft + metrics.clientWidth - leftWidth
		}),
		[metrics, leftWidth]
	);
}
