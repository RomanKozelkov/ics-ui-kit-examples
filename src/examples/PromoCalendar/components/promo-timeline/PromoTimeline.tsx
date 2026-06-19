import { useMemo } from "react";
import { TimelineContext as DndTimelineContext, type UsePanStrategy } from "dnd-timeline";
import { type Modifier as DndKitModifier, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { usePromoCalendarSuspenseQuery } from "../../api/promo.queries";
import { useText, useLocale } from "../../i18n";
import { usePanelStore } from "../management-panel/store/panel.store";
import { useIsDayOff } from "./hooks/useIsDayOff";
import { usePreparedItems } from "./hooks/usePreparedItems";
import { usePromoOverrides } from "./hooks/usePromoOverrides";
import { CalendarSurface } from "./ui/CalendarSurface";
import {
	DRAG_ACTIVATION_PX,
	LEFT_W,
	MS_DAY,
	TOUCH_ACTIVATION_DELAY_MS,
	TOUCH_ACTIVATION_TOLERANCE_PX
} from "./utils/constants";
import { getTimelineModel } from "./utils/timeline";
import { buildGroupTree, isGrouped } from "./utils/grouping";
import type { GroupField } from "./types";

const noop = () => {};

export function PromoTimeline({
	year,
	dateBegin,
	dateEnd,
	groupBy = []
}: {
	year: number;
	dateBegin: string;
	dateEnd: string;
	groupBy?: GroupField[];
}) {
	// Данные грузятся на весь год; смена месяцев не вызывает рефетч — окно режется на клиенте.
	// Suspense-query: data гарантированно есть, loading/error держит внешний QueryBoundary.
	const { data } = usePromoCalendarSuspenseQuery({ year });

	const text = useText();
	const locale = useLocale();
	const dayWidth = usePanelStore((s) => s.dayWidth);

	// Модификатор dnd-kit правит transform-дельту на каждом pointermove ещё до того,
	// как она попадёт в бар. y:0 — только горизонталь. round(x/dayWidth)*dayWidth —
	// живой снап: бар прыгает шагами по ширине дня (как в Notion), а не попиксельно.
	// Старт бара уже выровнен по дню (deltaXStart кратен dayWidth), поэтому снап дельты
	// сохраняет выравнивание.
	const modifiers = useMemo<DndKitModifier[]>(
		() => [
			({ transform }) => {
				return { ...transform, x: Math.round(transform.x / dayWidth) * dayWidth, y: 0 };
			}
		],
		[dayWidth]
	);

	// Порог активации: жест ниже порога — клик (открытие карточки), выше — драг.
	// Без порога любой микросдвиг стартует драг, dnd-kit глушит трейлинг-click и onClick не доходит.
	const sensors = useSensors(
		useSensor(MouseSensor, { activationConstraint: { distance: DRAG_ACTIVATION_PX } }),
		useSensor(TouchSensor, {
			activationConstraint: {
				delay: TOUCH_ACTIVATION_DELAY_MS,
				tolerance: TOUCH_ACTIVATION_TOLERANCE_PX
			}
		})
	);

	const isDayOff = useIsDayOff(year);
	const timeline = useMemo(() => getTimelineModel(dateBegin, dateEnd, isDayOff), [dateBegin, dateEnd, isDayOff]);
	// range пиннится на весь период; масштаб задаётся шириной timeline-элемента (см. CalendarSurface).
	const range = useMemo(() => ({ start: timeline.startMs, end: timeline.endMs }), [timeline]);
	const { items, onPeriodChange } = usePromoOverrides(data, year);
	const prepared = usePreparedItems(items);
	// Оставляем только промо, пересекающие видимое окно месяцев, — иначе группы/строки
	// плодились бы из записей вне диапазона.
	const visible = useMemo(
		() => prepared.filter((p) => p.startMs < timeline.endMs && p.endMs > timeline.startMs),
		[prepared, timeline.startMs, timeline.endMs]
	);
	const groups = useMemo(
		() => buildGroupTree(visible, groupBy, text("calendar.allPromos"), locale),
		[visible, groupBy, text, locale]
	);
	// Без группировки левая колонка пуста — схлопываем до 0, чтобы не резервировать место.
	const grouped = isGrouped(groups);
	const leftW = grouped ? LEFT_W : 0;
	// Сайдбар — отдельная колонка (two-pane), поэтому dnd sidebarWidth=0, а измеряемый
	// контентный элемент равен только ширине контента.
	const contentWidth = timeline.totalDays * dayWidth;

	return (
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
	);
}
