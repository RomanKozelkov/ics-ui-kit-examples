import { useTimelineContext } from "dnd-timeline";
import { memo } from "react";
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
	channelType: item.channelType,
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

	return (
		<div
			ref={ref}
			{...attributes}
			{...restListeners}
			{...restBarProps}
			onPointerEnter={showTooltip}
			onPointerLeave={(e) => {
				edgeLabelPointerLeave(e);
				hideTooltip();
			}}
			onPointerDown={(e) => {
				dndPointerDown?.(e);
				hideTooltip();
			}}
			onClick={() => openEdit(toPromo(item))}
			className={cn("transition-[filter] duration-150", getItemShadow(isDragging, isResizing))}
			style={{ ...itemStyle, top: ROW_PAD, zIndex: isDragging ? 1000 : undefined }}
		>
			<div style={itemContentStyle}>
				<PromoBar item={item} overflowLeft={overflowLeft} overflowRight={overflowRight} focus="low" />
			</div>
		</div>
	);
});
