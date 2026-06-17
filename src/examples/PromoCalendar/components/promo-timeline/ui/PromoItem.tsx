import { useItem, useTimelineContext } from "dnd-timeline";
import { Tooltip, TooltipContent, TooltipTrigger } from "ics-ui-kit/components/tooltip";
import type { PreparedPromoItem } from "../types";
import { ROW_PAD } from "../utils/constants";
import { PromoBar } from "./PromoBar";
import { PromoTooltipContent } from "./PromoTooltipContent";

export function PromoItem({ item }: { item: PreparedPromoItem }) {
	const { range } = useTimelineContext();
	const overflowLeft = item.startMs < range.start;
	const overflowRight = item.endMs > range.end;

	const { setNodeRef, listeners, attributes, itemStyle, itemContentStyle } = useItem({
		id: String(item.id),
		span: { start: item.startMs, end: item.endMs },
		resizeHandleWidth: 0,
		data: { promo: item }
	});

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<div ref={setNodeRef} {...listeners} {...attributes} style={{ ...itemStyle, top: ROW_PAD }}>
					<div style={itemContentStyle}>
						<PromoBar item={item} overflowLeft={overflowLeft} overflowRight={overflowRight} />
					</div>
				</div>
			</TooltipTrigger>
			<TooltipContent>
				<PromoTooltipContent item={item} />
			</TooltipContent>
		</Tooltip>
	);
}
