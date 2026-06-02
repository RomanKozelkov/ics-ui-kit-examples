import { cn } from "ics-ui-kit/lib/utils";
import React from "react";

export function InsertionTailLine({ className, style }: { className?: string; style?: React.CSSProperties }) {
	return (
		<div
			className={cn(
				"absolute right-0 top-1/2 h-px -translate-y-1/2 rounded-full opacity-0 [transition:left_140ms_ease-out,opacity_150ms_75ms] group-hover/insertion:opacity-100",
				className
			)}
			style={style}
		/>
	);
}
