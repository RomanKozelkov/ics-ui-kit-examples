import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "ics-ui-kit/components/tooltip";
import { BAR_H, LANE_H } from "../../utils/constants";
import type { PreparedPromo } from "../../types";

type Props = {
	item: PreparedPromo;
	dayWidth: number;
	totalDays: number;
};

function PromoBarView({ item, left, width }: { item: PreparedPromo; left: number; width: number }) {
	return (
		<div
			className="absolute flex cursor-default select-none items-center gap-1 overflow-hidden whitespace-nowrap px-2 text-[11.5px] font-medium leading-none text-white shadow-sm"
			style={{
				left,
				top: (LANE_H - BAR_H) / 2,
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
			<span className="shrink-0 opacity-75">/ {item.durationDays} дн.</span>
			{item.overflowRight && <span className="ml-auto shrink-0 opacity-80">›</span>}
		</div>
	);
}

function PromoTooltipContent({ item }: { item: PreparedPromo }) {
	return (
		<dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 text-xs">
			<dt className="text-muted-foreground">Наименование:</dt>
			<dd>{item.title}</dd>
			<dt className="text-muted-foreground">Длительность:</dt>
			<dd>{item.durationDays} дн.</dd>
			<dt className="text-muted-foreground">Бренд:</dt>
			<dd>{item.brandName}</dd>
			<dt className="text-muted-foreground">Канал:</dt>
			<dd>{item.channelType}</dd>
			<dt className="text-muted-foreground">SKU:</dt>
			<dd>{item.skuName}</dd>
		</dl>
	);
}

export function PromoBar({ item, dayWidth, totalDays }: Props) {
	const left = Math.max(item.beginIdx, 0) * dayWidth;
	const right = Math.min(item.endIdx + 1, totalDays) * dayWidth;
	// минимум полколонки, чтобы очень короткие промо оставались кликабельными
	const width = Math.max(right - left, dayWidth * 0.5);

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<PromoBarView item={item} left={left} width={width} />
				</TooltipTrigger>
				<TooltipContent>
					<PromoTooltipContent item={item} />
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
