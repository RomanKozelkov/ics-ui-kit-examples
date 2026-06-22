import { memo, useMemo, useSyncExternalStore } from "react";
import { useRow as useDndTimelineRow } from "dnd-timeline";
import type { PreparedPromoItem } from "../types";
import { LANE_H } from "../utils/layout";
import { parseEdgeKey, rowEdgeKey } from "../utils/edgeArrows";
import { useTimelineScroll } from "./TimelineScrollContext";
import { EdgeArrows } from "./EdgeArrows";
import { PromoItem } from "./PromoItem";

type Props = {
	rowId: string;
	items: PreparedPromoItem[];
	borderBottom?: boolean;
};

/** Контентная строка lane: только промо-бары. Сайдбар вынесен в отдельную колонку (two-pane). */
export const LaneRow = memo(function LaneRow({ rowId, items, borderBottom }: Props) {
	const { setNodeRef, rowStyle, rowWrapperStyle } = useDndTimelineRow({ id: rowId });
	const { viewportStore, toX } = useTimelineScroll();

	// Какие edge-стрелки показать: строка пуста во вьюпорте → ведём к ближайшему off-screen промо.
	// Снапшот — примитив-строка: строка перерисовывается только когда цели стрелок реально сменились,
	// а не на каждый кадр скролла (useSyncExternalStore сравнивает снапшоты через Object.is).
	const edgeKey = useSyncExternalStore(viewportStore.subscribe, () => rowEdgeKey(items, viewportStore.get(), toX));
	const edges = useMemo(() => parseEdgeKey(edgeKey), [edgeKey]);

	// Фон строки прозрачный: непрозрачный bg перекрыл бы полосы dayOff из GridBackground
	// (строка — flex item, красится атомарно фон+бары, сетку между ними не вставить).
	// Базовая заливка приходит от surface (bg-primary-bg, тот же цвет).
	const { left, right } = edges;
	return (
		// content-visibility: браузер пропускает layout/paint строк вне вьюпорта; intrinsic-size
		// держит высоту строки (LANE_H), чтобы общая высота полотна и фоновая сетка не плыли.
		<div
			style={{
				...rowWrapperStyle,
				width: "100%",
				contentVisibility: "auto",
				containIntrinsicSize: `auto ${LANE_H}px`
			}}
		>
			<div ref={setNodeRef} style={{ ...rowStyle, height: LANE_H }} className={borderBottom ? "border-b" : ""}>
				{items.map((item) => (
					<PromoItem key={item.id} item={item} />
				))}

				<EdgeArrows left={left} right={right} />
			</div>
		</div>
	);
});
