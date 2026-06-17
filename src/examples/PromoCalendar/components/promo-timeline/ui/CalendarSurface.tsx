import { useRef } from "react";
import { useTimelineContext } from "dnd-timeline";
import { TooltipProvider } from "ics-ui-kit/components/tooltip";
import { useCollapsiblePaths } from "../hooks/useCollapsiblePaths";
import { useItemDragMonitor } from "../hooks/useItemDragMonitor";
import { useScrollControl } from "../hooks/useScrollControl";
import { useTimelineHeader } from "../hooks/useTimelineHeader";
import type { TimelineModel } from "../utils/timeline";
import type { GroupNode } from "../utils/grouping";
import { SURFACE_MAX_H } from "../utils/constants";
import { GridBackground } from "./GridBackground";
import { ContentGroup } from "./ContentGroup";
import { SidebarColumn } from "./SidebarColumn";
import { TimelineHeader } from "./TimelineHeader";

export function CalendarSurface({
	timeline,
	groups,
	onItemMoved,
	leftWidth,
	contentWidth,
	dayWidth,
	isGrouped
}: {
	timeline: TimelineModel;
	groups: GroupNode[];
	onItemMoved: (id: string, startMs: number, endMs: number) => void;
	/** Ширина сайдбар-колонки, px (0 без группировки). */
	leftWidth: number;
	/** Ширина контентной колонки: totalDays * dayWidth. Задаёт масштаб (px/день). */
	contentWidth: number;
	dayWidth: number;
	isGrouped: boolean;
}) {
	const { setTimelineRef, style } = useTimelineContext();
	const { headerHeight } = useTimelineHeader();
	const { collapsedPaths, onToggle } = useCollapsiblePaths();
	const scrollRef = useRef<HTMLDivElement>(null);

	useItemDragMonitor(onItemMoved);
	useScrollControl({ scrollRef, timeline, dayWidth });

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

						{/* Контентная колонка: измеряемый dnd-элемент (ширина = масштаб). */}
						<div
							ref={setTimelineRef}
							className="flex shrink-0 flex-col"
							// overflow:visible вместо клиппинга библиотеки — скроллит внешний контейнер.
							style={{ ...style, overflow: "visible", minWidth: undefined, width: contentWidth }}
						>
							<TimelineHeader timeline={timeline} leftWidth={leftWidth} />
							{/* flex-col: строки из dnd-timeline идут inline-flex; без блокификации между
							    ними остаются просветы line-box, сквозь которые на H-скролле видно сетку. */}
							<div className="relative flex flex-col">
								<GridBackground timeline={timeline} />
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
							</div>
						</div>
					</div>
				</div>
			</div>
		</TooltipProvider>
	);
}
