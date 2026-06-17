import { useRow as useDndTimelineRow } from "dnd-timeline";
import type { PreparedPromoItem } from "../types";
import { LANE_H } from "../utils/constants";
import { PromoItem } from "./PromoItem";

type Props = {
	rowId: string;
	items: PreparedPromoItem[];
	borderBottom?: boolean;
};

/** Контентная строка lane: только промо-бары. Сайдбар вынесен в отдельную колонку (two-pane). */
export function LaneRow({ rowId, items, borderBottom }: Props) {
	const { setNodeRef, rowStyle, rowWrapperStyle } = useDndTimelineRow({ id: rowId });

	return (
		<div
			style={{ ...rowWrapperStyle, width: "100%" }}
			className={`bg-primary-bg ${borderBottom ? "border-b" : ""}`}
		>
			<div ref={setNodeRef} style={{ ...rowStyle, height: LANE_H }}>
				{items.map((item) => (
					<PromoItem key={item.id} item={item} />
				))}
			</div>
		</div>
	);
}
