import type { TimelineDay } from "../utils/timeline";
import type { PreparedPromo } from "../utils/layout";
import { BAR_GAP, BAR_H, ROW_PAD } from "../utils/constants";
import { GridBackground } from "./GridBackground";
import { PromoBar } from "./promo-bar/PromoBar";

export function Body({
	days,
	items,
	laneCount,
	dayWidth,
	totalDays
}: {
	days: TimelineDay[];
	items: PreparedPromo[];
	laneCount: number;
	dayWidth: number;
	totalDays: number;
}) {
	// at least 1 lane worth of height even when empty
	const bodyH = Math.max(laneCount, 1) * (BAR_H + BAR_GAP) - BAR_GAP + ROW_PAD * 2;

	return (
		<div className="relative" style={{ width: days.length * dayWidth, height: bodyH }}>
			<GridBackground days={days} dayWidth={dayWidth} height={bodyH} />
			{items.map((item) => (
				<PromoBar key={item.id} item={item} dayWidth={dayWidth} totalDays={totalDays} />
			))}
		</div>
	);
}
