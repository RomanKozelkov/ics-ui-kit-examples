import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { ViewportStore } from "../hooks/useTimelineViewport";

/**
 * Скролл-контекст таймлайна для строк lane: store видимого окна, перевод ms→контент-px и
 * центрирующий скролл. Поднят из CalendarSurface, чтобы LaneRow не тянул scrollRef и
 * геометрию сквозь рекурсию ContentGroup.
 *
 * Окно отдаётся как external store (не реактивное значение): значение контекста стабильно на
 * скролле, поэтому строки не перерисовываются каскадом — каждая подписывается на store сама.
 */
export type TimelineScroll = {
	/** External store видимого окна — строки читают через useSyncExternalStore. */
	viewportStore: ViewportStore;
	/** ms → x в координатах контента (origin = первый день). */
	toX: (ms: number) => number;
	/** Центрировать день `ms` в видимой области; smooth — анимировать. */
	scrollToMs: (ms: number, smooth?: boolean) => void;
	/** Ширина sticky-сайдбара, px — left-инсет для левой edge-стрелки (0 без группировки). */
	leftWidth: number;
};

const TimelineScrollContext = createContext<TimelineScroll | null>(null);

export function TimelineScrollProvider({ value, children }: { value: TimelineScroll; children: ReactNode }) {
	return <TimelineScrollContext.Provider value={value}>{children}</TimelineScrollContext.Provider>;
}

export function useTimelineScroll(): TimelineScroll {
	const ctx = useContext(TimelineScrollContext);
	if (!ctx) throw new Error("useTimelineScroll must be used within TimelineScrollProvider");
	return ctx;
}
