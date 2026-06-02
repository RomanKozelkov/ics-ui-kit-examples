import { cn } from "ics-ui-kit/lib/utils";
import React from "react";
import { InsertionDepthIcon } from "./InsertionDepthIcon";
import { InsertionConnectorLine } from "./InsertionConnectorLine";
import { InsertionTailLine } from "./InsertionTailLine";
import { useInsertionLine } from "../../../hooks/useInsertionLine";

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
		const { items, tailLeft, isTailSolid, handleMouseMove, handleMouseLeave } = useInsertionLine({
			minDepth,
			maxDepth,
			levelOffset: level - 1,
			onParentHover
		});

		return (
			<div
				ref={ref}
				data-sidebar="sidebar-insertion-line"
				className={cn("group/insertion absolute inset-x-0 bottom-0 z-10 h-2", className)}
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
			>
				{items.map(({ depth, isHidden, isPlaceholder, iconLeft, connectorLeft }) => (
					<React.Fragment key={depth}>
						{connectorLeft !== null && (
							<InsertionConnectorLine style={{ left: connectorLeft }} isHidden={isHidden} />
						)}
						<InsertionDepthIcon
							isHidden={isHidden}
							isPlaceholder={isPlaceholder}
							style={{ left: iconLeft }}
							onClick={() => onAdd(depth)}
						/>
					</React.Fragment>
				))}

				<InsertionTailLine
					style={{ left: tailLeft }}
					className={
						isTailSolid
							? "bg-primary-fg"
							: "[background:linear-gradient(90deg,hsl(var(--muted))_0%,rgba(113,113,122,0.00)_100%)]"
					}
				/>
			</div>
		);
	}
);
SidebarInsertionLine.displayName = "SidebarInsertionLine";
