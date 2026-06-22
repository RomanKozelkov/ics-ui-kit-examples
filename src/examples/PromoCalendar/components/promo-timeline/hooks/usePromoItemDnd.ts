import { useItem } from "dnd-timeline";
import type { ResizeEndEvent, ResizeStartEvent, Span } from "dnd-timeline";
import { useCallback, useState } from "react";
import type { PreparedPromoItem } from "../types";
import { RESIZE_HANDLE_W } from "../utils/layout";
import { useEdgeLabel } from "./useEdgeLabel";

export function usePromoItemDnd(item: PreparedPromoItem) {
	const itemSpan: Span = { start: item.startMs, end: item.endMs };
	const { resizeHandlers, barProps, registerNode } = useEdgeLabel(itemSpan);
	const [isResizing, setIsResizing] = useState(false);

	const { onResizeStart: origOnResizeStart, onResizeEnd: origOnResizeEnd, onResizeMove } = resizeHandlers;

	const onResizeStart = useCallback(
		(e: ResizeStartEvent) => {
			setIsResizing(true);
			origOnResizeStart(e);
		},
		[origOnResizeStart]
	);

	const onResizeEnd = useCallback(
		(_e: ResizeEndEvent) => {
			setIsResizing(false);
			origOnResizeEnd();
		},
		[origOnResizeEnd]
	);

	const { setNodeRef, listeners, attributes, itemStyle, itemContentStyle, isDragging } = useItem({
		id: String(item.id),
		span: itemSpan,
		resizeHandleWidth: RESIZE_HANDLE_W,
		data: { promo: item },
		onResizeStart,
		onResizeMove,
		onResizeEnd
	});

	const ref = useCallback(
		(node: HTMLDivElement | null) => {
			registerNode(node);
			setNodeRef(node);
		},
		[registerNode, setNodeRef]
	);

	return { ref, listeners, attributes, barProps, itemStyle, itemContentStyle, isDragging, isResizing };
}
