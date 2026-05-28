import { useState, useCallback, type MouseEvent } from "react";
import { depthFromMouseX } from "./sidebarInsertionLineUtils";

export function useDepthSelection(depth: number, minDepth: number, maxDepth: number) {
	const [selectedDepth, setSelectedDepth] = useState(depth);

	const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
		const rect = e.currentTarget.getBoundingClientRect();
		setSelectedDepth(depthFromMouseX(e.clientX - rect.left, maxDepth, minDepth));
	}, [maxDepth, minDepth]);

	const handleMouseEnter = useCallback(() => {
		setSelectedDepth(depth);
	}, [depth]);

	const handleMouseLeave = useCallback(() => {
		setSelectedDepth(depth);
	}, [depth]);

	return {
		selectedDepth,
		handlers: {
			onMouseMove: handleMouseMove,
			onMouseEnter: handleMouseEnter,
			onMouseLeave: handleMouseLeave,
		},
	};
}
