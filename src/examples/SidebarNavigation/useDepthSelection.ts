import React, { useState } from "react";
import { depthFromMouseX } from "./sidebarInsertionLineUtils";

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

	return {
		selectedDepth,
		handlers: {
			onMouseMove: handleMouseMove,
			onMouseEnter: handleMouseEnter,
			onMouseLeave: handleMouseLeave,
		},
	};
}
