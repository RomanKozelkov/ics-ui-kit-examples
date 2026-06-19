import { useMemo } from "react";
import { TimelineContext as DndTimelineContext } from "dnd-timeline";
import { usePromoCalendarSuspenseQuery } from "../../api/promo.queries";
import { useIsDayOff } from "./hooks/useIsDayOff";
import { usePreparedItems } from "./hooks/usePreparedItems";
import { usePromoOverrides } from "./hooks/usePromoOverrides";
import { useDndConfig } from "./hooks/useDndConfig";
import { useTimelineGroups } from "./hooks/useTimelineGroups";
import { CalendarSurface } from "./ui/CalendarSurface";
import { StaleOverlay } from "./ui/StaleOverlay";
import { LEFT_W } from "./utils/layout";
import { MS_DAY } from "./utils/date";
import { getTimelineModel } from "./utils/timeline";
import type { GroupField } from "./types";

const noop = () => {};

export function PromoTimeline({
	year,
	dateBegin,
	dateEnd,
	groupBy = [],
	dayWidth,
	isStale
}: {
	year: number;
	dateBegin: string;
	dateEnd: string;
	groupBy?: GroupField[];
	dayWidth: number;
	isStale: boolean;
}) {
	// Данные грузятся на весь год; смена месяцев не вызывает рефетч — окно режется на клиенте.
	// Suspense-query: data гарантированно есть, loading/error держит внешний QueryBoundary.
	const { data } = usePromoCalendarSuspenseQuery({ year });

	const isDayOff = useIsDayOff(year);
	const timeline = useMemo(() => getTimelineModel(dateBegin, dateEnd, isDayOff), [dateBegin, dateEnd, isDayOff]);
	// range пиннится на весь период; масштаб задаётся шириной timeline-элемента (см. CalendarSurface).
	const range = useMemo(() => ({ start: timeline.startMs, end: timeline.endMs }), [timeline]);

	const { items, onPeriodChange } = usePromoOverrides(data, year);
	const prepared = usePreparedItems(items);
	const { groups, grouped } = useTimelineGroups(prepared, timeline, groupBy);

	// Без группировки левая колонка пуста — схлопываем до 0, чтобы не резервировать место.
	const leftW = grouped ? LEFT_W : 0;
	// Сайдбар — отдельная колонка (two-pane), поэтому dnd sidebarWidth=0, а измеряемый
	// контентный элемент равен только ширине контента.
	const contentWidth = timeline.totalDays * dayWidth;

	const { sensors, modifiers } = useDndConfig(dayWidth);
	return (
		<StaleOverlay stale={isStale}>
			<DndTimelineContext
				range={range}
				sidebarWidth={0}
				sensors={sensors}
				// onResizeEnd/onRangeChanged здесь noop намеренно: обязательные пропсы контекста,
				// но drag и resize ловим подпиской useTimelineMonitor (см. useItemDragMonitor) —
				// единая точка записи интервала. Дублировать обработку в пропсах не нужно.
				onResizeEnd={noop}
				onRangeChanged={noop}
				usePanStrategy={noop}
				rangeGridSizeDefinition={MS_DAY}
				modifiers={modifiers}
				// Live-resize берёт геометрию из getSpanFromResizeEvent, а тот снапит край к
				// rangeGridSize (MS_DAY) → ресайз прыгает по дням, а не попиксельно.
				useResizeAnimation
			>
				<CalendarSurface
					timeline={timeline}
					groups={groups}
					onPeriodChange={onPeriodChange}
					layout={{ leftWidth: leftW, contentWidth, dayWidth, isGrouped: grouped }}
				/>
			</DndTimelineContext>
		</StaleOverlay>
	);
}
