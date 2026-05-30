import { cn } from "ics-ui-kit/lib/utils";
import React, { useState } from "react";
import { INSERTION_BUTTON_SIZE } from "../../../utils/constants";
import { iconLeft, depthFromMouseX } from "../../../utils/sidebarInsertionLineUtils";
import { InsertionDepthIcon } from "./InsertionDepthIcon";
import { InsertionConnectorLine } from "./InsertionConnectorLine";
import { InsertionTailLine } from "./InsertionTailLine";

export type SidebarInsertionLineProps = {
	className?: string;
	minDepth: number;
	maxDepth: number;
	level: number;
	onAdd: (depth: number) => void;
	onParentHover?: (depth: number | null) => void;
};

export const SidebarInsertionLine = React.forwardRef<HTMLDivElement, SidebarInsertionLineProps>(
	({ className, minDepth, maxDepth, level, onAdd, onParentHover }, ref) => {
		const levelOffset = level - 1;
		const [hoverDepth, setHoverDepth] = useState<number | null>(null);

		const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
			const rect = e.currentTarget.getBoundingClientRect();
			const depth = depthFromMouseX(e.clientX - rect.left, maxDepth, minDepth, levelOffset);
			setHoverDepth(depth);
			onParentHover?.(depth);
		};

		const handleMouseLeave = () => {
			setHoverDepth(null);
			onParentHover?.(null);
		};

		const count = maxDepth - minDepth + 1;
		const activeDepth = hoverDepth ?? maxDepth;

		return (
			<div
				ref={ref}
				data-sidebar="sidebar-insertion-line"
				className={cn("group/insertion absolute inset-x-0 bottom-0 z-10 h-2 translate-y-1/2", className)}
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
			>
				{Array.from({ length: count }, (_, i) => {
					const d = minDepth + i;
					const isHidden = hoverDepth === null || d > hoverDepth;
					const isPlaceholder = d < activeDepth;
					const prevLeft = i > 0 ? iconLeft(minDepth + i - 1, levelOffset) : null;
					const connectorStyle =
						prevLeft !== null
							? { left: prevLeft + INSERTION_BUTTON_SIZE, opacity: isHidden ? 0 : undefined }
							: undefined;

					return (
						<React.Fragment key={d}>
							{connectorStyle && <InsertionConnectorLine style={connectorStyle} />}
							<InsertionDepthIcon
								isHidden={isHidden}
								isPlaceholder={isPlaceholder}
								style={{ left: iconLeft(d, levelOffset) }}
								onClick={() => onAdd(d)}
							/>
						</React.Fragment>
					);
				})}

				<InsertionTailLine
					style={{
						left: iconLeft(activeDepth, levelOffset) + INSERTION_BUTTON_SIZE
					}}
				/>
			</div>
		);
	}
);
SidebarInsertionLine.displayName = "SidebarInsertionLine";
