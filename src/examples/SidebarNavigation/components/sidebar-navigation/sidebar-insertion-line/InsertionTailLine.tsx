import { cn } from "ics-ui-kit/lib/utils";
import React from "react";

export function InsertionTailLine({ style, isSolid }: { style?: React.CSSProperties; isSolid?: boolean }) {
	return (
		<div
			className={cn(
				"absolute right-0 top-1/2 h-px -translate-y-1/2 rounded-full opacity-0 [transition:left_140ms_ease-out,opacity_150ms_75ms] group-hover/insertion:opacity-100",
				isSolid
					? "bg-primary-fg"
					: "[background:linear-gradient(90deg,hsl(var(--muted))_0%,rgba(113,113,122,0.00)_100%)]"
			)}
			style={style}
		/>
	);
}
