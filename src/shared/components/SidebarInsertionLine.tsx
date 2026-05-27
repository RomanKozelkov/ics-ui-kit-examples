import { IconButton } from "ics-ui-kit/components/button";
import { cn } from "ics-ui-kit/lib/utils";
import { CircleFadingPlus, CirclePlus } from "lucide-react";
import React from "react";

export type SidebarInsertionLineProps = {
	className?: string;
	onAdd?: () => void;
};

export const SidebarInsertionLine = React.forwardRef<HTMLDivElement, SidebarInsertionLineProps>(
	({ className, onAdd }, ref) => {
		return (
			<div
				data-sidebar="sidebar-insertion-line"
				className={cn(
					"group/insertion absolute inset-x-0 bottom-0 z-10 flex h-2 translate-y-1/2 cursor-pointer flex-row items-center border-none bg-transparent p-0",
					className
				)}
				ref={ref}
				onClick={onAdd}
			>
				<div className="peer/icon-wrap group/icon-wrap grid opacity-0 transition-opacity delay-75 duration-150 group-hover/insertion:opacity-100">
					<IconButton
						icon={CircleFadingPlus}
						size="xs"
						className="col-start-1 row-start-1 h-4 w-4 p-0.5 text-muted group-hover/icon-wrap:opacity-0"
						variant="link"
						tabIndex={-1}
					/>
					<IconButton
						icon={CirclePlus}
						size="xs"
						className="col-start-1 row-start-1 h-4 w-4 p-0.5 text-primary-fg opacity-0 group-hover/icon-wrap:opacity-100"
						variant="link"
						tabIndex={-1}
					/>
				</div>
				<div className="relative h-px w-full opacity-0 transition-opacity delay-75 duration-150 before:absolute before:inset-0 before:[background:linear-gradient(90deg,#71717A_0%,rgba(113,113,122,0.00)_100%)] group-hover/insertion:opacity-100 peer-hover/icon-wrap:bg-primary-fg peer-hover/icon-wrap:opacity-100 peer-hover/icon-wrap:before:bg-primary-fg" />
			</div>
		);
	}
);
SidebarInsertionLine.displayName = "SidebarInsertionLine";
