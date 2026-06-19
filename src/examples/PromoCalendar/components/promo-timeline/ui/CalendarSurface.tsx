import { useMemo, useRef } from "react";
import { useTimelineContext } from "dnd-timeline";
import { TooltipProvider } from "ics-ui-kit/components/tooltip";
import { usePanelStore } from "../../management-panel/store/panel.store";
import { useCollapsiblePaths } from "../hooks/useCollapsiblePaths";
import { useItemDragMonitor } from "../hooks/useItemDragMonitor";
import { useScrollControl } from "../hooks/useScrollControl";
import { useTimelineHeader } from "../hooks/useTimelineHeader";
import { useTimelineViewport } from "../hooks/useTimelineViewport";
import type { TimelineModel } from "../utils/timeline";
import type { GroupNode } from "../utils/grouping";
import { SURFACE_MAX_H } from "../utils/constants";
import { msToContentX } from "../utils/timeline";
import { GridBackground } from "./GridBackground";
import { ContentGroup } from "./ContentGroup";
import { SidebarColumn } from "./SidebarColumn";
import { TimelineHeader } from "./TimelineHeader";
import { TimelineScrollProvider } from "./TimelineScrollContext";

/** Геометрия раскладки полотна — производные размеры из стора/модели (px). */
export type SurfaceLayout = {
	/** Ширина сайдбар-колонки, px (0 без группировки). */
	leftWidth: number;
	/** Ширина контентной колонки: totalDays * dayWidth. Задаёт масштаб (px/день). */
	contentWidth: number;
	dayWidth: number;
	isGrouped: boolean;
};

export function CalendarSurface({
	timeline,
	groups,
	onPeriodChange,
	layout
}: {
	timeline: TimelineModel;
	groups: GroupNode[];
	onPeriodChange: (id: string, startMs: number, endMs: number) => void;
	layout: SurfaceLayout;
}) {
	const { leftWidth, contentWidth, dayWidth, isGrouped } = layout;
	const { setTimelineRef, style } = useTimelineContext();
	const { headerHeight } = useTimelineHeader();
	const { collapsedPaths, onToggle } = useCollapsiblePaths();
	const scrollRef = useRef<HTMLDivElement>(null);

	// Триггер «Сегодня» из стора панели; хук скролла остаётся независимым от источника.
	const showToday = usePanelStore((s) => s.showToday);
	const resetShowToday = usePanelStore((s) => s.resetShowToday);

	useItemDragMonitor(onPeriodChange);
	const { scrollToMs } = useScrollControl({ scrollRef, timeline, dayWidth, showToday, onTodayConsumed: resetShowToday });

	// Видимое окно + ms→px: питают edge-стрелки навигации к off-screen промо в строках.
	const viewport = useTimelineViewport({ scrollRef, leftWidth, dayWidth });
	const startMs = timeline.startMs;
	const scroll = useMemo(
		() => ({ viewport, scrollToMs, toX: (ms: number) => msToContentX(ms, startMs, dayWidth), leftWidth }),
		[viewport, scrollToMs, startMs, dayWidth, leftWidth]
	);

	return (
		<TooltipProvider>
			<div
				className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-border bg-primary-bg"
				style={{ maxHeight: SURFACE_MAX_H }}
			>
				<div ref={scrollRef} className="min-h-0 flex-1 overflow-auto">
					{/* Горизонтальный ряд из двух колонок шире вьюпорта → H-скролл контейнера. */}
					<div className="flex" style={{ width: leftWidth + contentWidth }}>
						<SidebarColumn
							groups={groups}
							width={leftWidth}
							headerHeight={headerHeight}
							collapsedPaths={collapsedPaths}
							onToggle={onToggle}
						/>

						<div
							ref={setTimelineRef}
							className="flex shrink-0 flex-col"
							// overflowY:visible вместо клиппинга библиотеки — скроллит внешний контейнер,
							// залипающая шапка работает. overflowX:clip обрезает бары промо, выходящих за
							// окно (промо на стыке лет: dateEnd в следующем январе), — иначе их box
							// растягивает scrollWidth и за месяцами появляется пустое место.
							// clip (в отличие от hidden) не создаёт scroll-контейнер → sticky не ломается.
							style={{ ...style, overflowX: "clip", overflowY: "visible", minWidth: undefined, width: contentWidth }}
						>
							<TimelineHeader timeline={timeline} leftWidth={leftWidth} />
							{/* flex-col: строки из dnd-timeline идут inline-flex; без блокификации между
							    ними остаются просветы line-box, сквозь которые на H-скролле видно сетку. */}
							<div className="relative flex flex-col">
								<GridBackground timeline={timeline} />
								<TimelineScrollProvider value={scroll}>
									{groups.map((group) => (
										<ContentGroup
											key={group.path}
											group={group}
											depth={0}
											collapsedPaths={collapsedPaths}
											headerHeight={headerHeight}
											showOwnHeader={isGrouped}
										/>
									))}
								</TimelineScrollProvider>
							</div>
						</div>
					</div>
				</div>
			</div>
		</TooltipProvider>
	);
}
