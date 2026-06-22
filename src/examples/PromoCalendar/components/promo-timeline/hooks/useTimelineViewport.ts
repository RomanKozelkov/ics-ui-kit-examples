import { useCallback, useEffect, useMemo, useRef } from "react";
import type { RefObject } from "react";

/** Видимое окно таймлайна в координатах контента (px от первого дня). */
export type TimelineViewport = {
	/** Левый край видимой области (= scrollLeft). */
	visibleStartX: number;
	/** Правый край видимой области (за вычетом sticky-сайдбара). */
	visibleEndX: number;
};

/**
 * External store видимого окна: `get()` + `subscribe()` для useSyncExternalStore.
 *
 * Намеренно НЕ React-state: при многих строках реактивный viewport в context перерисовывал
 * бы все строки каждый кадр скролла. Здесь строки подписываются точечно и перерисовываются
 * только когда меняется их собственный снапшот edge-стрелок.
 */
export type ViewportStore = {
	get: () => TimelineViewport | null;
	subscribe: (listener: () => void) => () => void;
};

/**
 * Отслеживает горизонтальное видимое окно скролл-контейнера таймлайна и раздаёт его как
 * external store. Окно — в координатах КОНТЕНТА (origin = первый день): из правого края
 * вычитается `leftWidth` (ширина sticky-сайдбара), поэтому окно напрямую сравнимо с `toX(ms)`.
 *
 * Слушает scroll (rAF-throttle — programmatic scrollLeft тоже триггерит) и ResizeObserver;
 * пере-измеряется при смене `dayWidth` (zoom двигает scrollLeft) и `leftWidth`.
 */
export function useTimelineViewportStore({
	scrollRef,
	leftWidth,
	dayWidth
}: {
	scrollRef: RefObject<HTMLElement | null>;
	leftWidth: number;
	dayWidth: number;
}): ViewportStore {
	const stateRef = useRef<TimelineViewport | null>(null);
	const listenersRef = useRef<Set<() => void>>(new Set());
	const rafRef = useRef<number | null>(null);

	const subscribe = useCallback((listener: () => void) => {
		listenersRef.current.add(listener);
		return () => {
			listenersRef.current.delete(listener);
		};
	}, []);

	const get = useCallback(() => stateRef.current, []);

	useEffect(() => {
		const el = scrollRef.current;
		if (!el) return;

		const measure = () => {
			const visibleStartX = el.scrollLeft;
			const visibleEndX = el.scrollLeft + el.clientWidth - leftWidth;

			const prev = stateRef.current;
			if (prev && prev.visibleStartX === visibleStartX && prev.visibleEndX === visibleEndX) return;

			stateRef.current = { visibleStartX, visibleEndX };
			listenersRef.current.forEach((l) => l());
		};

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
		// dayWidth/leftWidth: zoom двигает scrollLeft программно, leftWidth меняет правый край — пере-измеряем.
	}, [scrollRef, dayWidth, leftWidth]);

	return useMemo(() => ({ get, subscribe }), [get, subscribe]);
}
