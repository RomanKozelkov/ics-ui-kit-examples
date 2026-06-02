import { cn } from "ics-ui-kit/lib/utils";
import React from "react";

export type InsertionConnectorLineProps = {
	style?: React.CSSProperties;
	isHidden?: boolean;
};

export function InsertionConnectorLine({ style, isHidden }: InsertionConnectorLineProps) {
	return (
		<div
			className={cn(
				"absolute top-1/2 h-px w-3 -translate-y-1/2 bg-primary-border transition-opacity duration-150",
				isHidden ? "opacity-0" : "opacity-0 group-hover/insertion:opacity-100"
			)}
			style={style}
		/>
	);
}
