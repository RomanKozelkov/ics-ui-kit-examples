import { useEdgeLabelStore } from "../store/edgeLabel.store";
import { EDGE_LABEL_GAP_PX, Z_INDEX } from "../utils/constants";

/**
 * Единственный always-mounted оверлей с датой края промо (как в Notion при hover/resize).
 * position: fixed по координатам из стора — не клипается overflow'ом полотна и не зависит от
 * ререндеров баров. Скрыт через display:none, пока стор пуст (узел остаётся в DOM).
 */
export function EdgeDateLabel() {
	const label = useEdgeLabelStore((s) => s.label);

	// flip → чип под баром (y = низ бара): сдвигаем вниз; иначе над баром (y = верх бара): вверх.
	const shiftY = label?.flip ? `${EDGE_LABEL_GAP_PX}px` : `calc(-100% - ${EDGE_LABEL_GAP_PX}px)`;

	return (
		<div
			aria-hidden
			className="pointer-events-none fixed select-none whitespace-nowrap rounded bg-foreground px-1.5 py-0.5 text-xs font-medium leading-none text-background shadow-md"
			style={{
				display: label ? "block" : "none",
				left: label?.x ?? 0,
				top: label?.y ?? 0,
				transform: `translate(-50%, ${shiftY})`,
				zIndex: Z_INDEX.edgeLabel
			}}
		>
			{label?.text}
		</div>
	);
}
