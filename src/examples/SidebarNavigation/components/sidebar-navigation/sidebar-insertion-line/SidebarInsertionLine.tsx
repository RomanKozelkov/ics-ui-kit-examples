import { cn } from "ics-ui-kit/lib/utils";
import React from "react";
import { INSERTION_BUTTON_SIZE } from "../../../utils/constants";
import { useDepthSelection } from "../../../hooks/useDepthSelection";
import { iconLeft } from "../../../utils/sidebarInsertionLineUtils";
import { InsertionDepthIcon } from "./InsertionDepthIcon";
import { InsertionConnectorLine } from "./InsertionConnectorLine";
import { InsertionTailLine } from "./InsertionTailLine";

export type SidebarInsertionLineProps = {
	className?: string;
	depth: number;
	minDepth: number;
	maxDepth: number;
	onAdd: (depth: number) => void;
};

export const SidebarInsertionLine = React.forwardRef<HTMLDivElement, SidebarInsertionLineProps>(
	({ className, depth, minDepth, maxDepth, onAdd }, ref) => {
		const { selectedDepth, handlers } = useDepthSelection(depth, minDepth, maxDepth);

		const count = maxDepth - minDepth + 1;

		return (
			<div
				ref={ref}
				data-sidebar="sidebar-insertion-line"
				className={cn(
					"group/insertion absolute inset-x-0 bottom-0 z-10 h-2 translate-y-1/2 cursor-pointer",
					className
				)}
				{...handlers}
				onClick={() => onAdd(selectedDepth)}
			>
				{Array.from({ length: count }, (_, i) => {
					const d = minDepth + i;
					const left = iconLeft(d);
					const isActive = d === selectedDepth;
					const isHidden = d > selectedDepth;
					const prevLeft = i > 0 ? iconLeft(minDepth + i - 1) : null;

					return (
						<React.Fragment key={d}>
							{prevLeft !== null && (
								<InsertionConnectorLine
									style={{ left: prevLeft + INSERTION_BUTTON_SIZE, ...(isHidden && { opacity: 0 }) }}
								/>
							)}
							<InsertionDepthIcon isActive={isActive} isHidden={isHidden} style={{ left }} />
						</React.Fragment>
					);
				})}

				<InsertionTailLine
					style={{
						left: iconLeft(selectedDepth) + INSERTION_BUTTON_SIZE
					}}
				/>
			</div>
		);
	}
);
SidebarInsertionLine.displayName = "SidebarInsertionLine";
