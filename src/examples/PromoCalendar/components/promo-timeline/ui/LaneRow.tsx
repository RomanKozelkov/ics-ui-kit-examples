import { memo, useMemo, useSyncExternalStore } from "react";
import { useRow as useDndTimelineRow } from "dnd-timeline";
import { IconButton } from "ics-ui-kit/components/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useText } from "../../../i18n";
import type { PreparedPromoItem } from "../types";
import { LANE_H } from "../utils/layout";
import { Z_INDEX } from "../utils/z-index";

const EDGE_ARROW_GAP = 4;
import { parseEdgeKey, rowEdgeKey } from "../utils/edgeArrows";
import { useTimelineScroll } from "./TimelineScrollContext";
import { PromoItem } from "./PromoItem";

type Props = {
	rowId: string;
	items: PreparedPromoItem[];
	borderBottom?: boolean;
};

/** Контентная строка lane: только промо-бары. Сайдбар вынесен в отдельную колонку (two-pane). */
export const LaneRow = memo(function LaneRow({ rowId, items, borderBottom }: Props) {
	const { setNodeRef, rowStyle, rowWrapperStyle } = useDndTimelineRow({ id: rowId });
	const text = useText();
	const { viewportStore, toX, scrollToMs, leftWidth } = useTimelineScroll();

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

				{/* Оверлей edge-стрелок: pointer-events off, кнопки sticky у краёв вьюпорта.
				    Sticky держит их на месте при H-скролле; left-инсет минует sticky-сайдбар. */}
				{(left !== null || right !== null) && (
					<div
						className="pointer-events-none absolute inset-0 flex items-center"
						style={{ zIndex: Z_INDEX.edgeArrow }}
					>
						{left !== null && (
							<IconButton
								variant="secondary"
								size="sm"
								icon={ChevronLeft}
								aria-label={text("calendar.scrollToNearestLeft")}
								className="pointer-events-auto sticky"
								style={{ left: leftWidth + EDGE_ARROW_GAP }}
								onClick={() => scrollToMs(left, true)}
							/>
						)}
						{right !== null && (
							<IconButton
								variant="secondary"
								size="sm"
								icon={ChevronRight}
								aria-label={text("calendar.scrollToNearestRight")}
								className="pointer-events-auto sticky ml-auto"
								style={{ right: EDGE_ARROW_GAP }}
								onClick={() => scrollToMs(right, true)}
							/>
						)}
					</div>
				)}
			</div>
		</div>
	);
});
