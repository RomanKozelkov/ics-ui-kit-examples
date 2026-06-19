import { usePromoTooltipStore } from "../store/promoTooltip.store";
import { Z_INDEX } from "../utils/z-index";

const TOOLTIP_GAP_PX = 6;
import { PromoTooltipContent } from "./PromoTooltipContent";

/**
 * Единственный always-mounted hover-тултип промо. position: fixed по координатам из стора — не
 * клипается overflow'ом полотна и не зависит от ререндеров баров. Скрыт через display:none, пока
 * стор пуст (узел остаётся в DOM). Заменяет per-bar Radix Tooltip ради производительности на больших
 * объёмах.
 */
export function PromoHoverTooltip() {
	const tooltip = usePromoTooltipStore((s) => s.tooltip);

	return (
		<div
			aria-hidden
			className="pointer-events-none fixed rounded-md border border-border bg-primary-bg px-2.5 py-1.5 text-foreground shadow-md"
			style={{
				display: tooltip ? "block" : "none",
				left: tooltip?.x ?? 0,
				top: tooltip?.y ?? 0,
				transform: `translate(-50%, calc(-100% - ${TOOLTIP_GAP_PX}px))`,
				zIndex: Z_INDEX.edgeLabel
			}}
		>
			{tooltip && <PromoTooltipContent item={tooltip.item} />}
		</div>
	);
}
