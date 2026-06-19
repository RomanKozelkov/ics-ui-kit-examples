import { memo } from "react";
import type { PreparedPromoItem } from "../types";
import { useText } from "../../../i18n";

/** Кегль текста промо-бара, px. Дробный — подобран под высоту бара (BAR_H), стандартные шаги Tailwind не подходят. */
const BAR_FONT_PX = 11.5;
const BAR_H = 22;
const BAR_RADIUS = 5;

/** Радиус скруглённого угла; 0 — когда бар обрезан этой стороной (уходит за диапазон). */
function corner(rounded: boolean) {
	return rounded ? BAR_RADIUS : 0;
}

export const PromoBar = memo(function PromoBar({
	item,
	overflowLeft,
	overflowRight
}: {
	item: PreparedPromoItem;
	overflowLeft: boolean;
	overflowRight: boolean;
}) {
	const text = useText();

	return (
		<div
			className="flex w-full select-none items-center gap-1 overflow-hidden whitespace-nowrap px-2 font-medium leading-none text-white shadow-sm"
			style={{
				height: BAR_H,
				fontSize: BAR_FONT_PX,
				background: item.color,
				borderTopLeftRadius: corner(!overflowLeft),
				borderBottomLeftRadius: corner(!overflowLeft),
				borderTopRightRadius: corner(!overflowRight),
				borderBottomRightRadius: corner(!overflowRight)
			}}
		>
			{overflowLeft && <span className="shrink-0 opacity-80">‹</span>}
			<span className="truncate">
				{item.title}
				<span className="opacity-75">
					{" "}
					/ {item.durationDays} {text("promo.daysShort")}
				</span>
			</span>
			{overflowRight && <span className="ml-auto shrink-0 opacity-80">›</span>}
		</div>
	);
});
