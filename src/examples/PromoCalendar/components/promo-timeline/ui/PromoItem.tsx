import { useItem, useTimelineContext } from "dnd-timeline";
import { Tooltip, TooltipContent, TooltipTrigger } from "ics-ui-kit/components/tooltip";
import type { PromoCalendarItem } from "../../../api/promo.types";
import { usePromoEditor } from "../../promo-editor/PromoEditorContext";
import type { PreparedPromoItem } from "../types";
import { RESIZE_HANDLE_W, ROW_PAD } from "../utils/constants";
import { PromoBar } from "./PromoBar";
import { PromoTooltipContent } from "./PromoTooltipContent";

// Доменный срез из подготовленного айтема (без timeline-полей color/startMs/...).
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

export function PromoItem({ item }: { item: PreparedPromoItem }) {
	const { range } = useTimelineContext();
	const { openEdit } = usePromoEditor();
	const overflowLeft = item.startMs < range.start;
	const overflowRight = item.endMs > range.end;

	const { setNodeRef, listeners, attributes, itemStyle, itemContentStyle } = useItem({
		id: String(item.id),
		span: { start: item.startMs, end: item.endMs },
		resizeHandleWidth: RESIZE_HANDLE_W,
		data: { promo: item }
	});

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<div
					ref={setNodeRef}
					{...listeners}
					{...attributes}
					onClick={() => openEdit(toPromo(item))}
					style={{ ...itemStyle, top: ROW_PAD }}
				>
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
