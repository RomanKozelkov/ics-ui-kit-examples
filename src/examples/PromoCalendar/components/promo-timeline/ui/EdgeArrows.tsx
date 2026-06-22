import { IconButton } from "ics-ui-kit/components/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useText } from "../../../i18n";
import { Z_INDEX } from "../utils/z-index";
import { useTimelineScroll } from "./TimelineScrollContext";

const EDGE_ARROW_GAP = 4;

type Props = {
	left: number | null;
	right: number | null;
};

export function EdgeArrows({ left, right }: Props) {
	const text = useText();
	const { scrollToMs, leftWidth } = useTimelineScroll();

	if (left === null && right === null) return null;

	return (
		<div
			className="pointer-events-none absolute inset-0 flex items-center"
			style={{ zIndex: Z_INDEX.edgeArrow }}
		>
			{left !== null && (
				<IconButton
					variant="outline"
					size="xs"
					icon={ChevronLeft}
					aria-label={text("calendar.scrollToNearestLeft")}
					className="pointer-events-auto sticky"
					style={{ left: leftWidth + EDGE_ARROW_GAP }}
					onClick={() => scrollToMs(left, true)}
				/>
			)}
			{right !== null && (
				<IconButton
					variant="outline"
					size="xs"
					icon={ChevronRight}
					aria-label={text("calendar.scrollToNearestRight")}
					className="pointer-events-auto sticky ml-auto"
					style={{ right: EDGE_ARROW_GAP }}
					onClick={() => scrollToMs(right, true)}
				/>
			)}
		</div>
	);
}
