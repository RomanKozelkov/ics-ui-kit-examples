import { IconButton } from "ics-ui-kit/components/button";
import { cn } from "ics-ui-kit/lib/utils";
import { CircleFadingPlus, CirclePlus } from "lucide-react";
import React from "react";
import { useDepthSelection } from "./useDepthSelection";

const BUTTON_SIZE = 16;

export type SidebarInsertionLineProps = {
	className?: string;
	depth: number;
	minDepth: number;
	maxDepth: number;
	onAdd: (depth: number) => void;
};

export const SidebarInsertionLine = React.forwardRef<HTMLDivElement, SidebarInsertionLineProps>(
	({ className, depth, minDepth, maxDepth, onAdd }, ref) => {
		const { selectedDepth, lineX, handlers } = useDepthSelection(depth, minDepth, maxDepth);

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
				<div
					className="group/icon-wrap absolute top-1/2 -translate-y-1/2"
					style={{
						left: lineX - BUTTON_SIZE / 2,
						width: BUTTON_SIZE,
						height: BUTTON_SIZE,
						transition: "left 140ms ease-out"
					}}
				>
					<IconButton
						icon={CircleFadingPlus}
						size="xs"
						className="absolute h-4 w-4 p-0.5 text-muted opacity-0 transition-opacity delay-75 duration-150 group-hover/insertion:opacity-100 group-hover/icon-wrap:opacity-0"
						variant="link"
						tabIndex={-1}
					/>
					<IconButton
						icon={CirclePlus}
						size="xs"
						className="absolute h-4 w-4 p-0.5 text-primary-fg opacity-0 transition-opacity delay-75 duration-150 group-hover/icon-wrap:opacity-100"
						variant="link"
						tabIndex={-1}
					/>
				</div>

				<div
					className="absolute top-1/2 h-px -translate-y-1/2 opacity-0 group-hover/insertion:opacity-100"
					style={{
						left: lineX + BUTTON_SIZE / 2,
						right: 14,
						transition: "left 140ms ease-out, opacity 150ms 75ms",
						background: "linear-gradient(90deg, #71717A 0%, rgba(113,113,122,0.00) 100%)"
					}}
				/>
			</div>
		);
	}
);
SidebarInsertionLine.displayName = "SidebarInsertionLine";
