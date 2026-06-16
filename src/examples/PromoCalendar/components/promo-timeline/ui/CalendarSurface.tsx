import { useRef } from "react";
import { useTimelineContext } from "dnd-timeline";
import { ScrollShadowContainer } from "ics-ui-kit/components/scroll-shadow-container";
import { useCollapsiblePaths } from "../hooks/useCollapsiblePaths";
import { useGroupedRows } from "../hooks/useGroupedRows";
import { useItemDragMonitor } from "../hooks/useItemDragMonitor";
import { useScrollControl } from "../hooks/useScrollControl";
import type { TimelineModel } from "../utils/timeline";
import { GroupSection } from "./GroupSection";
import { TimelineHeader } from "./TimelineHeader";

export function CalendarSurface({
	timeline,
	groups,
	onItemMoved,
	elementWidth,
	dayWidth
}: {
	timeline: TimelineModel;
	groups: ReturnType<typeof useGroupedRows>;
	onItemMoved: (id: string, startMs: number, endMs: number) => void;
	/** Ширина timeline-элемента: LEFT_W + totalDays * dayWidth. Задаёт масштаб (px/день). */
	elementWidth: number;
	dayWidth: number;
}) {
	const { setTimelineRef, style } = useTimelineContext();
	const { collapsedPaths, onToggle } = useCollapsiblePaths();
	const scrollRef = useRef<HTMLDivElement>(null);

	useItemDragMonitor(onItemMoved);
	useScrollControl({ scrollRef, timeline, dayWidth });

	const isGrouped = groups.length > 1 || (groups[0] && groups[0].children.length > 0);

	return (
		<div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-border bg-primary-bg">
			<ScrollShadowContainer ref={scrollRef} className="min-h-0 flex-1 overflow-auto">
				<div
					ref={setTimelineRef}
					// Широкий измеряемый элемент: его ширина = масштаб. overflow:visible вместо
					// клиппинга библиотеки — скроллит внешний контейнер.
					style={{ ...style, overflow: "visible", minWidth: undefined, width: elementWidth }}
				>
					<TimelineHeader timeline={timeline} />
					<div className="relative">
						{groups.map((g) => (
							<GroupSection
								key={g.path}
								group={g}
								depth={0}
								rangeStart={timeline.startMs}
								rangeEnd={timeline.endMs}
								collapsedPaths={collapsedPaths}
								onToggle={onToggle}
								showOwnHeader={isGrouped}
							/>
						))}
					</div>
				</div>
			</ScrollShadowContainer>
		</div>
	);
}
