import { useMemo } from "react";
import { TimelineContext as DndTimelineContext, type UsePanStrategy } from "dnd-timeline";
import type { Modifier as DndKitModifier } from "@dnd-kit/core";
import { ErrorState } from "ics-ui-kit/components/error-state";
import { Loader } from "ics-ui-kit/components/loader";
import { usePromoCalendarQuery } from "../../api/promo.queries";
import { useText } from "../../i18n";
import { usePanelStore } from "../management-panel/store/panel.store";
import { usePreparedItems } from "./hooks/usePreparedItems";
import { usePromoOverrides } from "./hooks/usePromoOverrides";
import { CalendarSurface } from "./ui/CalendarSurface";
import { LEFT_W, MS_DAY } from "./utils/constants";
import { getTimelineModel } from "./utils/timeline";
import { buildGroupTree, isGrouped } from "./utils/grouping";
import type { GroupField } from "./types";

// Можем двигать промо только по горизонтали (y: 0)
const restrictHorizontal: DndKitModifier = ({ transform }) => ({ ...transform, y: 0 });
const noop = () => {};

// Пан/зум через range отключён — колесо целиком отдаём нативному скроллу контейнера.
// Стратегия-хук ничего не подписывает; тип UsePanStrategy возвращает void, cleanup не ждётся.
const useNoPanStrategy: UsePanStrategy = () => {};

export function PromoTimeline({
	dateBegin,
	dateEnd,
	groupBy = []
}: {
	dateBegin: string;
	dateEnd: string;
	groupBy?: GroupField[];
}) {
	const { data, isLoading, isError } = usePromoCalendarQuery({ dateBegin, dateEnd });
	const text = useText();
	const dayWidth = usePanelStore((s) => s.dayWidth);

	const timeline = useMemo(() => getTimelineModel(dateBegin, dateEnd), [dateBegin, dateEnd]);
	// range пиннится на весь период; масштаб задаётся шириной timeline-элемента (см. CalendarSurface).
	const range = useMemo(() => ({ start: timeline.startMs, end: timeline.endMs }), [timeline]);
	const { items, onItemMoved } = usePromoOverrides(data);
	const prepared = usePreparedItems(items);
	const groups = useMemo(
		() => buildGroupTree(prepared, groupBy, text("calendar.allPromos")),
		[prepared, groupBy, text]
	);
	// Без группировки левая колонка пуста — схлопываем до 0, чтобы не резервировать место.
	const grouped = isGrouped(groups);
	const leftW = grouped ? LEFT_W : 0;
	// Сайдбар — отдельная колонка (two-pane), поэтому dnd sidebarWidth=0, а измеряемый
	// контентный элемент равен только ширине контента.
	const contentWidth = timeline.totalDays * dayWidth;

	if (isLoading) return <Loader>{text("calendar.loading")}</Loader>;
	if (isError) return <ErrorState>{text("calendar.error")}</ErrorState>;

	return (
		<DndTimelineContext
			range={range}
			sidebarWidth={0}
			onResizeEnd={noop}
			onRangeChanged={noop}
			usePanStrategy={useNoPanStrategy}
			rangeGridSizeDefinition={MS_DAY}
			modifiers={[restrictHorizontal]}
		>
			<CalendarSurface
				timeline={timeline}
				groups={groups}
				onItemMoved={onItemMoved}
				leftWidth={leftW}
				contentWidth={contentWidth}
				dayWidth={dayWidth}
				isGrouped={grouped}
			/>
		</DndTimelineContext>
	);
}
