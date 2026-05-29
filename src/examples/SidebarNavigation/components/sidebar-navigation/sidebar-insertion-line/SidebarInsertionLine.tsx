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
	onAdd: (depth: number) => void;
};

export const SidebarInsertionLine = React.forwardRef<HTMLDivElement, SidebarInsertionLineProps>(
	({ className, minDepth, maxDepth, onAdd }, ref) => {
		const [hoverDepth, setHoverDepth] = useState(maxDepth);

		const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
			const rect = e.currentTarget.getBoundingClientRect();
			setHoverDepth(depthFromMouseX(e.clientX - rect.left, maxDepth, minDepth));
		};

		const handleMouseLeave = () => setHoverDepth(maxDepth);

		const count = maxDepth - minDepth + 1;

		return (
			<div
				ref={ref}
				data-sidebar="sidebar-insertion-line"
				className={cn(
					"group/insertion absolute inset-x-0 bottom-0 z-10 h-2 translate-y-1/2",
					className
				)}
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
			>
				{Array.from({ length: count }, (_, i) => {
					const d = minDepth + i;
					const isActive = d === hoverDepth;
					const isHidden = d > hoverDepth;
					const prevLeft = i > 0 ? iconLeft(minDepth + i - 1) : null;
					const connectorStyle = prevLeft !== null
						? { left: prevLeft + INSERTION_BUTTON_SIZE, opacity: isHidden ? 0 : undefined }
						: undefined;

					return (
						<React.Fragment key={d}>
							{connectorStyle && <InsertionConnectorLine style={connectorStyle} />}
							<InsertionDepthIcon isActive={isActive} isHidden={isHidden} style={{ left: iconLeft(d) }} onClick={() => onAdd(d)} />
						</React.Fragment>
					);
				})}

				<InsertionTailLine
					style={{
						left: iconLeft(hoverDepth) + INSERTION_BUTTON_SIZE
					}}
				/>
			</div>
		);
	}
);
SidebarInsertionLine.displayName = "SidebarInsertionLine";
