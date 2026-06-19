import { useItem, useTimelineContext } from "dnd-timeline";
import type { Span } from "dnd-timeline";
import { memo, type PointerEvent, useCallback, useEffect, useRef } from "react";
import type { PromoCalendarItem } from "../../../api/promo.types";
import { useEdgeLabel } from "../hooks/useEdgeLabel";
import { usePromoEditor } from "../../promo-editor/PromoEditorContext";
import { usePromoTooltipStore } from "../store/promoTooltip.store";
import type { PreparedPromoItem } from "../types";
import { RESIZE_HANDLE_W, ROW_PAD, TOOLTIP_HOVER_DELAY_MS } from "../utils/constants";
import { PromoBar } from "./PromoBar";

// Доменный срез без timeline-полей color/startMs/....
const toPromo = (item: PreparedPromoItem): PromoCalendarItem => ({
	id: item.id,
	title: item.title,
	dateBegin: item.dateBegin,
	dateEnd: item.dateEnd,
	channelType: item.channelType,
	companyName: item.companyName,
	companyId: item.companyId,
	channelId: item.channelId
});

export const PromoItem = memo(function PromoItem({ item }: { item: PreparedPromoItem }) {
	const { range } = useTimelineContext();
	const { openEdit } = usePromoEditor();
	const overflowLeft = item.startMs < range.start;
	const overflowRight = item.endMs > range.end;

	const itemSpan: Span = { start: item.startMs, end: item.endMs };
	const { resizeHandlers, barProps, registerNode } = useEdgeLabel(itemSpan);

	const { setNodeRef, listeners, attributes, itemStyle, itemContentStyle } = useItem({
		id: String(item.id),
		span: itemSpan,
		resizeHandleWidth: RESIZE_HANDLE_W,
		data: { promo: item },
		...resizeHandlers
	});

	const handleRef = useCallback(
		(node: HTMLDivElement | null) => {
			registerNode(node);
			setNodeRef(node);
		},
		[registerNode, setNodeRef]
	);

	// Один общий тултип на всё полотно (PromoHoverTooltip): пишем в стор императивно, бар не
	// ререндерится. Задержка как у Radix — без мигания при свайпе курсором по барам.
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const clearTimer = () => {
		if (timerRef.current) clearTimeout(timerRef.current);
		timerRef.current = null;
	};
	const showTooltip = useCallback(
		(e: PointerEvent<HTMLDivElement>) => {
			// buttons!==0 → идёт жест (drag/resize), не hover.
			if (e.buttons !== 0) return;
			const x = e.clientX;
			const y = e.currentTarget.getBoundingClientRect().top;
			clearTimer();
			timerRef.current = setTimeout(() => usePromoTooltipStore.getState().show({ item, x, y }), TOOLTIP_HOVER_DELAY_MS);
		},
		[item]
	);
	const hideTooltip = useCallback(() => {
		clearTimer();
		usePromoTooltipStore.getState().hide();
	}, []);
	// Снять висящий таймер при анмаунте (скролл/смена данных удаляют бары).
	useEffect(() => clearTimer, []);

	return (
		<div
			ref={handleRef}
			{...listeners}
			{...attributes}
			{...barProps}
			onPointerEnter={showTooltip}
			// barProps.onPointerLeave (edge-label) сохраняем — дописываем скрытие тултипа.
			onPointerLeave={(e) => {
				barProps.onPointerLeave(e);
				hideTooltip();
			}}
			// listeners.onPointerDown — активатор resize/drag (PointerSensor). Композим, не затираем:
			// прямое присваивание убивает его, и resize на pointer-событиях мёртв.
			onPointerDown={(e) => {
				listeners?.onPointerDown?.(e);
				hideTooltip();
			}}
			onClick={() => openEdit(toPromo(item))}
			style={{ ...itemStyle, top: ROW_PAD }}
		>
			<div style={itemContentStyle}>
				<PromoBar item={item} overflowLeft={overflowLeft} overflowRight={overflowRight} />
			</div>
		</div>
	);
});
