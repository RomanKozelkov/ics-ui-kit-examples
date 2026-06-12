import type { CSSProperties, HTMLAttributes } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "ics-ui-kit/components/tooltip";
import type { TimelineItem } from "../types";
import { ITEM_GAP } from "../utils/constants";

// ItemRendererProps библиотекой наружу не экспортируется — берём только нужное.
type ItemRendererProps = {
	item: TimelineItem;
	itemContext: { dragging: boolean };
	getItemProps: (params: { style?: CSSProperties }) => HTMLAttributes<HTMLDivElement> & { key: string };
};

export function renderPromoItem({ item, itemContext, getItemProps }: ItemRendererProps) {
	const { overflowLeft, overflowRight } = item;
	const radius = (on: boolean) => (on ? 5 : 0);

	const { key, ...itemProps } = getItemProps({
		style: {
			background: "transparent",
			border: "none",
			padding: `${ITEM_GAP}px 0`,
			boxShadow: "none"
		}
	});

	return (
		<div key={key} {...itemProps}>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<div
							className="flex h-full w-full select-none items-center gap-1 overflow-hidden whitespace-nowrap px-2 text-[11.5px] font-medium leading-none text-white shadow-sm"
							style={{
								background: item.color,
								borderTopLeftRadius: radius(!overflowLeft),
								borderBottomLeftRadius: radius(!overflowLeft),
								borderTopRightRadius: radius(!overflowRight),
								borderBottomRightRadius: radius(!overflowRight),
								opacity: itemContext.dragging ? 0.7 : 1
							}}
						>
							{overflowLeft && <span className="shrink-0 opacity-80">‹</span>}
							<span className="truncate">
								{item.title}
								<span className="opacity-75"> / {item.durationDays} дн.</span>
							</span>
							{overflowRight && <span className="ml-auto shrink-0 opacity-80">›</span>}
						</div>
					</TooltipTrigger>
					<TooltipContent>
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
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
}
