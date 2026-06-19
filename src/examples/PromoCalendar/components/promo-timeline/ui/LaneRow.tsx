import { useMemo } from "react";
import { useRow as useDndTimelineRow } from "dnd-timeline";
import { IconButton } from "ics-ui-kit/components/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useText } from "../../../i18n";
import type { PreparedPromoItem } from "../types";
import { EDGE_ARROW_GAP, LANE_H, Z_INDEX } from "../utils/constants";
import { rowEdgeTargets } from "../utils/edgeArrows";
import { useTimelineScroll } from "./TimelineScrollContext";
import { PromoItem } from "./PromoItem";

type Props = {
	rowId: string;
	items: PreparedPromoItem[];
	borderBottom?: boolean;
};

/** Контентная строка lane: только промо-бары. Сайдбар вынесен в отдельную колонку (two-pane). */
export function LaneRow({ rowId, items, borderBottom }: Props) {
	const { setNodeRef, rowStyle, rowWrapperStyle } = useDndTimelineRow({ id: rowId });
	const text = useText();
	const { viewport, toX, scrollToMs, leftWidth } = useTimelineScroll();

	// Какие edge-стрелки показать: строка пуста во вьюпорте → ведём к ближайшему off-screen промо.
	const edges = useMemo(() => rowEdgeTargets(items, viewport, toX), [items, viewport, toX]);

	// Фон строки прозрачный: непрозрачный bg перекрыл бы полосы dayOff из GridBackground
	// (строка — flex item, красится атомарно фон+бары, сетку между ними не вставить).
	// Базовая заливка приходит от surface (bg-primary-bg, тот же цвет).
	return (
		<div style={{ ...rowWrapperStyle, width: "100%" }}>
			<div ref={setNodeRef} style={{ ...rowStyle, height: LANE_H }} className={borderBottom ? "border-b" : ""}>
				{items.map((item) => (
					<PromoItem key={item.id} item={item} />
				))}

				{/* Оверлей edge-стрелок: pointer-events off, кнопки sticky у краёв вьюпорта.
				    Sticky держит их на месте при H-скролле; left-инсет минует sticky-сайдбар. */}
				{(edges.left || edges.right) && (
					<div
						className="pointer-events-none absolute inset-0 flex items-center"
						style={{ zIndex: Z_INDEX.edgeArrow }}
					>
						{edges.left && (
							<IconButton
								variant="secondary"
								size="sm"
								icon={ChevronLeft}
								aria-label={text("calendar.scrollToNearestLeft")}
								className="pointer-events-auto sticky"
								style={{ left: leftWidth + EDGE_ARROW_GAP }}
								onClick={() => edges.left && scrollToMs(edges.left.ms, true)}
							/>
						)}
						{edges.right && (
							<IconButton
								variant="secondary"
								size="sm"
								icon={ChevronRight}
								aria-label={text("calendar.scrollToNearestRight")}
								className="pointer-events-auto sticky ml-auto"
								style={{ right: EDGE_ARROW_GAP }}
								onClick={() => edges.right && scrollToMs(edges.right.ms, true)}
							/>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
