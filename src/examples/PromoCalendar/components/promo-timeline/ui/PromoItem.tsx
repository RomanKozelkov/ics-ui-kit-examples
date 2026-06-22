import { useTimelineContext } from "dnd-timeline";
import { memo, useCallback, useMemo } from "react";
import { cn } from "ics-ui-kit/lib/utils";
import type { PromoCalendarItem } from "../../../api/promo.types";
import { usePromoItemDnd } from "../hooks/usePromoItemDnd";
import { usePromoTooltip } from "../hooks/usePromoTooltip";
import { usePromoEditor } from "../../promo-editor/PromoEditorContext";
import type { PreparedPromoItem } from "../types";
import { ROW_PAD } from "../utils/layout";
import { PromoBar } from "./PromoBar";

function getItemShadow(isDragging: boolean, isResizing: boolean): string {
	if (isDragging) return "[filter:drop-shadow(0_6px_16px_rgb(0_0_0/0.18))]";
	if (isResizing) return "[filter:drop-shadow(0_2px_8px_rgb(0_0_0/0.12))]";
	return "hover:[filter:drop-shadow(0_2px_6px_rgb(0_0_0/0.10))]";
}

const toPromo = (item: PreparedPromoItem): PromoCalendarItem => ({
	id: item.id,
	title: item.title,
	dateBegin: item.dateBegin,
	dateEnd: item.dateEnd,
	channelName: item.channelName,
	companyName: item.companyName,
	companyId: item.companyId,
	channelId: item.channelId
});

export const PromoItem = memo(function PromoItem({ item }: { item: PreparedPromoItem }) {
	const { range } = useTimelineContext();
	const { openEdit } = usePromoEditor();
	const { showTooltip, hideTooltip } = usePromoTooltip(item);

	const overflowLeft = item.startMs < range.start;
	const overflowRight = item.endMs > range.end;

	const { ref, listeners, attributes, barProps, itemStyle, itemContentStyle, isDragging, isResizing } =
		usePromoItemDnd(item);

	const { onPointerDown: dndPointerDown, ...restListeners } = listeners ?? {};
	const { onPointerLeave: edgeLabelPointerLeave, ...restBarProps } = barProps;

	const onPointerLeave = useCallback(
		(e: React.PointerEvent<HTMLDivElement>) => {
			edgeLabelPointerLeave(e);
			hideTooltip();
		},
		[edgeLabelPointerLeave, hideTooltip]
	);

	const onPointerDown = useCallback(
		(e: React.PointerEvent<HTMLDivElement>) => {
			dndPointerDown?.(e);
			hideTooltip();
		},
		[dndPointerDown, hideTooltip]
	);

	const style = { ...itemStyle, top: ROW_PAD, zIndex: isDragging || isResizing ? 1000 : undefined };

	return (
		<div
			ref={ref}
			{...attributes}
			{...restListeners}
			{...restBarProps}
			onPointerEnter={showTooltip}
			onPointerLeave={onPointerLeave}
			onPointerDown={onPointerDown}
			onClick={() => openEdit(toPromo(item))}
			className={cn("outline-none transition-[filter] duration-150", getItemShadow(isDragging, isResizing))}
			style={style}
		>
			<div style={itemContentStyle}>
				<PromoBar item={item} overflowLeft={overflowLeft} overflowRight={overflowRight} focus="low" />
			</div>
		</div>
	);
});
