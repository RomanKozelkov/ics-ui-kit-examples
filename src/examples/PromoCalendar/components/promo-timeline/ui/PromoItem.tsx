import { useItem, useTimelineContext } from "dnd-timeline";
import type { Span } from "dnd-timeline";
import { memo, useCallback } from "react";
import type { PromoCalendarItem } from "../../../api/promo.types";
import { useEdgeLabel } from "../hooks/useEdgeLabel";
import { usePromoTooltip } from "../hooks/usePromoTooltip";
import { usePromoEditor } from "../../promo-editor/PromoEditorContext";
import type { PreparedPromoItem } from "../types";
import { RESIZE_HANDLE_W, ROW_PAD } from "../utils/layout";
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

	const { showTooltip, hideTooltip } = usePromoTooltip(item);

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
