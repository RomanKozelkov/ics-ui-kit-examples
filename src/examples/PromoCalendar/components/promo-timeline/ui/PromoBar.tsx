import { memo } from "react";
import { tv } from "tailwind-variants";
import type { PreparedPromoItem } from "../types";
import { useText } from "../../../i18n";

/** Кегль текста промо-бара, px. Дробный — подобран под высоту бара (BAR_H), стандартные шаги Tailwind не подходят. */
const BAR_FONT_PX = 11.5;
const BAR_H = 22;

const promoBar = tv({
	base: "flex w-full select-none items-center gap-1 overflow-hidden whitespace-nowrap border px-2 text-xs font-medium leading-none",
	variants: {
		status: {
			info: "",
			success: "",
			warning: "",
			error: ""
		},
		focus: {
			low: "",
			high: "border-transparent text-white"
		},
		rounded: {
			none: "",
			left: "rounded-l-md",
			right: "rounded-r-md",
			both: "rounded-md"
		}
	},
	compoundVariants: [
		{
			focus: "low",
			status: "info",
			class: "border-status-info-primary-border bg-status-info-bg text-status-info-fg"
		},
		{
			focus: "low",
			status: "success",
			class: "border-status-success-primary-border bg-status-success-bg text-status-success-fg"
		},
		{
			focus: "low",
			status: "warning",
			class: "border-status-warning-primary-border bg-status-warning-bg text-status-warning-fg"
		},
		{
			focus: "low",
			status: "error",
			class: "border-status-error-primary-border bg-status-error-bg text-status-error-fg"
		},
		{ focus: "high", status: "info", class: "bg-status-info" },
		{ focus: "high", status: "success", class: "bg-status-success" },
		{ focus: "high", status: "warning", class: "bg-status-warning" },
		{ focus: "high", status: "error", class: "bg-status-error" }
	],
	defaultVariants: {
		focus: "low"
	}
});

type PromoBarRounded = "none" | "left" | "right" | "both";

function getRounded(overflowLeft: boolean, overflowRight: boolean): PromoBarRounded {
	if (!overflowLeft && !overflowRight) return "both";
	if (!overflowLeft) return "left";
	if (!overflowRight) return "right";
	return "none";
}

export const PromoBar = memo(function PromoBar({
	item,
	overflowLeft,
	overflowRight,
	focus = "low"
}: {
	item: PreparedPromoItem;
	overflowLeft: boolean;
	overflowRight: boolean;
	focus?: "low" | "high";
}) {
	const rounded = getRounded(overflowLeft, overflowRight);
	const text = useText();

	return (
		<div className={promoBar({ status: item.color, focus, rounded })} style={{ height: BAR_H }}>
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
