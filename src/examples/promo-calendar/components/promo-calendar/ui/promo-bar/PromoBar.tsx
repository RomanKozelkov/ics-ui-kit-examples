import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "ics-ui-kit/components/tooltip";
import { BAR_GAP, BAR_H, ROW_PAD } from "../../utils/constants";
import { PreparedPromo } from "../../utils/layout";

type PromoBarViewProps = {
	item: PreparedPromo;
	left: number;
	top: number;
	width: number;
};

function PromoBarView({ item, left, top, width }: PromoBarViewProps) {
	return (
		<div
			className="absolute flex cursor-default select-none items-center gap-1 overflow-hidden whitespace-nowrap px-2 text-[11.5px] font-medium leading-none text-white shadow-sm"
			style={{
				left,
				top,
				width,
				height: BAR_H,
				background: item.color,
				borderRadius: 5,
				borderTopLeftRadius: item.overflowLeft ? 0 : 5,
				borderBottomLeftRadius: item.overflowLeft ? 0 : 5,
				borderTopRightRadius: item.overflowRight ? 0 : 5,
				borderBottomRightRadius: item.overflowRight ? 0 : 5
			}}
		>
			{item.overflowLeft && <span className="shrink-0 opacity-80">‹</span>}
			<span className="truncate">{item.title}</span>
			{item.overflowRight && <span className="ml-auto shrink-0 opacity-80">›</span>}
		</div>
	);
}

function PromoTooltipContent({ item }: { item: PreparedPromo }) {
	// TODO move to model
	const duration = promoDurationDays(item);
	return (
		<dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 text-xs">
			<dt className="text-muted-foreground">Наименование:</dt>
			<dd>{item.title}</dd>
			<dt className="text-muted-foreground">Длительность:</dt>
			<dd>{duration} дн.</dd>
			<dt className="text-muted-foreground">Бренд:</dt>
			<dd>{item.brandName}</dd>
			<dt className="text-muted-foreground">Канал:</dt>
			<dd>{item.channelType}</dd>
			<dt className="text-muted-foreground">SKU:</dt>
			<dd>{item.skuName}</dd>
		</dl>
	);
}

function promoDurationDays(item: PreparedPromo): number {
	return item.durationDays;
}

export function PromoBar({ item, dayWidth, totalDays }: { item: PreparedPromo; dayWidth: number; totalDays: number }) {
	const maxX = totalDays * dayWidth;
	const rawLeft = item.beginIdx * dayWidth;
	const rawWidth = (item.endIdx - item.beginIdx + 1) * dayWidth;

	const left = Math.max(rawLeft, 0);
	const right = rawLeft + rawWidth;
	// minimum half a cell wide so very short promos are still clickable
	const width = Math.max(Math.min(right, maxX) - left, dayWidth * 0.5);
	const top = item.lane * (BAR_H + BAR_GAP) + ROW_PAD;

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<PromoBarView item={item} left={left} top={top} width={width} />
				</TooltipTrigger>
				<TooltipContent>
					<PromoTooltipContent item={item} />
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
