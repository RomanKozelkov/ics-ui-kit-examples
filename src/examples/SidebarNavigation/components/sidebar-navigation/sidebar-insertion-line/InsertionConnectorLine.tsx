import React from "react";

export type InsertionConnectorLineProps = {
	style?: React.CSSProperties;
};

export function InsertionConnectorLine({ style }: InsertionConnectorLineProps) {
	return (
		<div
			className="absolute top-1/2 h-px w-3 -translate-y-1/2 bg-primary-border opacity-0 transition-opacity duration-150 group-hover/insertion:opacity-100"
			style={style}
		/>
	);
}
