import { IconButton } from "ics-ui-kit/components/button";
import { cn } from "ics-ui-kit/lib/utils";
import { CircleFadingPlus, CirclePlus } from "lucide-react";
import React from "react";
import { iconLeft } from "./sidebarInsertionLineUtils";
import { INSERTION_BUTTON_SIZE } from "./constants";
import { useDepthSelection } from "./useDepthSelection";

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
								<div
									className="absolute top-1/2 h-px w-3 -translate-y-1/2 bg-muted opacity-0 transition-opacity duration-150 group-hover/insertion:opacity-100"
									style={{
										left: prevLeft + INSERTION_BUTTON_SIZE,
										...(isHidden && { opacity: 0 })
									}}
								/>
							)}

							<div
								className="absolute top-1/2 -translate-y-1/2"
								style={{
									left,
									width: INSERTION_BUTTON_SIZE,
									height: INSERTION_BUTTON_SIZE
								}}
							>
								<IconButton
									icon={isActive ? CirclePlus : CircleFadingPlus}
									size="xs"
									className={cn(
										"insertion-icon absolute h-4 w-4 p-0.5 transition-opacity duration-150",
										isActive ? "text-primary-fg" : "text-muted",
										isHidden ? "opacity-0" : "opacity-0 group-hover/insertion:opacity-100"
									)}
									variant="link"
									tabIndex={-1}
								/>
							</div>
						</React.Fragment>
					);
				})}

				<div
					className="absolute right-0 top-1/2 h-px -translate-y-1/2 opacity-0 [background:linear-gradient(90deg,hsl(var(--muted))_0%,rgba(113,113,122,0.00)_100%)] group-hover/insertion:opacity-100 [.group\/insertion:has(.insertion-icon:hover)_&]:bg-primary-fg"
					style={{
						left: iconLeft(selectedDepth) + INSERTION_BUTTON_SIZE,
						transition: "left 140ms ease-out, opacity 150ms 75ms"
					}}
				/>
			</div>
		);
	}
);
SidebarInsertionLine.displayName = "SidebarInsertionLine";
