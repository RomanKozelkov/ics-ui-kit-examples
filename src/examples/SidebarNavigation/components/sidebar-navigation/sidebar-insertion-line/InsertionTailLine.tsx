import React from "react";

export function InsertionTailLine({ style }: { style?: React.CSSProperties }) {
	return (
		<div
			className="absolute right-0 top-1/2 h-px -translate-y-1/2 opacity-0 [background:linear-gradient(90deg,hsl(var(--muted))_0%,rgba(113,113,122,0.00)_100%)] [transition:left_140ms_ease-out,opacity_150ms_75ms] group-hover/insertion:opacity-100 [.group\/insertion:has(.insertion-icon:hover)_&]:bg-primary-fg"
			style={style}
		/>
	);
}
