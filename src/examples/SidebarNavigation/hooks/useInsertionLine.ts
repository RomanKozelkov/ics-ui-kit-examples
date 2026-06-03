import React, { useState } from "react";
import { INSERTION_BUTTON_SIZE } from "../utils/constants";
import { depthFromMouseX, iconLeft } from "../utils/sidebarInsertionLineUtils";

export type InsertionItem = {
	depth: number;
	isHidden: boolean;
	isPlaceholder: boolean;
	isActive: boolean;
	iconLeft: number;
	connectorLeft: number | null;
};

type Options = {
	minDepth: number;
	maxDepth: number;
	levelOffset: number;
	onParentHover?: (depth: number | null) => void;
};

export function useInsertionLine({ minDepth, maxDepth, levelOffset, onParentHover }: Options) {
	const [hoverDepth, setHoverDepth] = useState<number | null>(null);
	const [isOverTail, setIsOverTail] = useState(false);

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const offsetX = e.clientX - rect.left;
		const depth = depthFromMouseX(offsetX, maxDepth, minDepth, levelOffset);
		const maxIconRightEdge = iconLeft(maxDepth, levelOffset) + INSERTION_BUTTON_SIZE;
		setHoverDepth(depth);
		setIsOverTail(offsetX > maxIconRightEdge);
		onParentHover?.(depth);
	};

	const handleMouseLeave = () => {
		setHoverDepth(null);
		setIsOverTail(false);
		onParentHover?.(null);
	};

	const activeDepth = hoverDepth ?? maxDepth;

	const items: InsertionItem[] = Array.from({ length: maxDepth - minDepth + 1 }, (_, i) => {
		const depth = minDepth + i;
		const prevLeft = i > 0 ? iconLeft(minDepth + i - 1, levelOffset) : null;
		return {
			depth,
			isHidden: hoverDepth === null || depth > hoverDepth,
			isPlaceholder: depth < activeDepth,
			isActive: hoverDepth !== null && depth === hoverDepth && !isOverTail,
			iconLeft: iconLeft(depth, levelOffset),
			connectorLeft: prevLeft !== null ? prevLeft + INSERTION_BUTTON_SIZE : null,
		};
	});

	const tailLeft = iconLeft(activeDepth, levelOffset) + INSERTION_BUTTON_SIZE;

	const isTailSolid = hoverDepth !== null && !isOverTail;

	const clickableDepth = hoverDepth !== null && !isOverTail ? hoverDepth : null;

	return { items, tailLeft, isTailSolid, clickableDepth, handleMouseMove, handleMouseLeave };
}
