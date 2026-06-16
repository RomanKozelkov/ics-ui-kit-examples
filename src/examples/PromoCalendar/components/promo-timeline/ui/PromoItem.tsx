import { useItem } from "dnd-timeline";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "ics-ui-kit/components/tooltip";
import type { PreparedPromoItem } from "../types";
import { BAR_H, ROW_PAD } from "../utils/constants";
import { useText } from "../../../i18n";

type Props = {
	item: PreparedPromoItem;
	rowId: string;
	rangeStart: number;
	rangeEnd: number;
};

export function PromoItem({ item, rowId, rangeStart, rangeEnd }: Props) {
	const text = useText();
	const overflowLeft = item.startMs < rangeStart;
	const overflowRight = item.endMs > rangeEnd;

	const { setNodeRef, listeners, attributes, itemStyle, itemContentStyle } = useItem({
		id: String(item.id),
		span: { start: item.startMs, end: item.endMs },
		resizeHandleWidth: 0,
		data: { promo: item }
	});

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<div ref={setNodeRef} {...listeners} {...attributes} style={{ ...itemStyle, top: ROW_PAD }}>
						<div style={itemContentStyle}>
							<div
								className="flex w-full select-none items-center gap-1 overflow-hidden whitespace-nowrap px-2 text-[11.5px] font-medium leading-none text-white shadow-sm"
								style={{
									height: BAR_H,
									background: item.color,
									borderRadius: 5,
									borderTopLeftRadius: overflowLeft ? 0 : 5,
									borderBottomLeftRadius: overflowLeft ? 0 : 5,
									borderTopRightRadius: overflowRight ? 0 : 5,
									borderBottomRightRadius: overflowRight ? 0 : 5
								}}
							>
								{overflowLeft && <span className="shrink-0 opacity-80">‹</span>}
								<span className="truncate">
									{item.title}
									<span className="opacity-75"> / {item.durationDays} {text("promo.daysShort")}</span>
								</span>
								{overflowRight && <span className="ml-auto shrink-0 opacity-80">›</span>}
							</div>
						</div>
					</div>
				</TooltipTrigger>
				<TooltipContent>
					<dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 text-xs">
						<dt className="text-muted-foreground">{text("promo.name")}</dt>
						<dd>{item.title}</dd>
						<dt className="text-muted-foreground">{text("promo.duration")}</dt>
						<dd>{item.durationDays} {text("promo.daysShort")}</dd>
						<dt className="text-muted-foreground">{text("promo.brand")}</dt>
						<dd>{item.brandName}</dd>
						<dt className="text-muted-foreground">{text("promo.channel")}</dt>
						<dd>{item.channelType}</dd>
						<dt className="text-muted-foreground">SKU:</dt>
						<dd>{item.skuName}</dd>
					</dl>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
