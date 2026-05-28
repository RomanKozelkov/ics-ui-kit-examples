import React, { useState } from "react";
import { BASE_X, depthFromMouseX } from "./sidebarInsertionLineUtils";
import { INDENT_SIDEBAR_ITEM_WIDTH } from "./constants";

export function useDepthSelection(depth: number, minDepth: number, maxDepth: number) {
	const [selectedDepth, setSelectedDepth] = useState(depth);

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		const rect = e.currentTarget.getBoundingClientRect();
		setSelectedDepth(depthFromMouseX(e.clientX - rect.left, maxDepth, minDepth));
	};

	const handleMouseEnter = () => {
		setSelectedDepth(depth);
	};

	const handleMouseLeave = () => {
		setSelectedDepth(depth);
	};

	const lineX = BASE_X + (selectedDepth - 1) * INDENT_SIDEBAR_ITEM_WIDTH;

	return {
		selectedDepth,
		lineX,
		handlers: {
			onMouseMove: handleMouseMove,
			onMouseEnter: handleMouseEnter,
			onMouseLeave: handleMouseLeave,
		},
	};
}
