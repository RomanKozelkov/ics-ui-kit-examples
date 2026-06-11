import { assignLanes } from "./lanes";
import { colorForIndex } from "./palette";
import { dayNumFromISO } from "./date";
import type { PromoData } from "../../../api/promo.queries";

export type PreparedPromo = PromoData & {
	beginIdx: number;
	endIdx: number;
	overflowLeft: boolean;
	overflowRight: boolean;
	lane: number;
	color: string;
};

export function prepareItems(
	items: PromoData[],
	startNum: number,
	totalDays: number
): { prepared: PreparedPromo[]; laneCount: number } {
	const all = items.map<PreparedPromo>((p, i) => {
		const beginIdx = dayNumFromISO(p.dateBegin) - startNum;
		const endIdx = dayNumFromISO(p.dateEnd) - startNum;
		return {
			...p,
			beginIdx,
			endIdx,
			overflowLeft: beginIdx < 0,
			overflowRight: endIdx > totalDays - 1,
			lane: 0,
			color: colorForIndex(i),
		};
	});

	const visible = all.filter((p) => p.endIdx >= 0 && p.beginIdx < totalDays);
	const laneCount = assignLanes(visible);

	return { prepared: visible, laneCount };
}
