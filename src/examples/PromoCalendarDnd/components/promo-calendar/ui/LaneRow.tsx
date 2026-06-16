import { useRow } from "dnd-timeline";
import type { PreparedPromoItem } from "../types";
import { LANE_H } from "../utils/constants";
import { PromoItem } from "./PromoItem";

type Props = {
	rowId: string;
	items: PreparedPromoItem[];
	rangeStart: number;
	rangeEnd: number;
	sidebar?: React.ReactNode;
};

export function LaneRow({ rowId, items, rangeStart, rangeEnd, sidebar }: Props) {
	const { setNodeRef, rowStyle, rowWrapperStyle, rowSidebarStyle } = useRow({ id: rowId });

	return (
		<div style={{ ...rowWrapperStyle, width: "100%" }}>
			<div style={{ ...rowSidebarStyle, height: LANE_H }} className="bg-primary-bg">
				{sidebar}
			</div>
			<div ref={setNodeRef} style={{ ...rowStyle, height: LANE_H }}>
				{items.map((item) => (
					<PromoItem key={item.id} item={item} rowId={rowId} rangeStart={rangeStart} rangeEnd={rangeEnd} />
				))}
			</div>
		</div>
	);
}
