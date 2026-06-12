import type { PreparedPromo } from "../types";
import { LANE_H, LEFT_W } from "../utils/constants";
import { PromoBar } from "./promo-bar/PromoBar";

type Props = {
	items: PreparedPromo[];
	dayWidth: number;
	totalDays: number;
	sidebar?: React.ReactNode;
};

export function LaneRow({ items, dayWidth, totalDays, sidebar }: Props) {
	return (
		<div className="flex w-full" style={{ height: LANE_H }}>
			{/* sticky-сайдбар: пуст для «без группировки» */}
			<div
				className="sticky left-0 z-[2] shrink-0 border-r border-border bg-primary-bg"
				style={{ width: LEFT_W }}
			>
				{sidebar}
			</div>
			<div className="relative flex-1">
				{items.map((item) => (
					<PromoBar key={item.id} item={item} dayWidth={dayWidth} totalDays={totalDays} />
				))}
			</div>
		</div>
	);
}
