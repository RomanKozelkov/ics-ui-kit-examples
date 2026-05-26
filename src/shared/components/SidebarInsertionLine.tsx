import { IconButton } from "ics-ui-kit/components/button";
import { cn } from "ics-ui-kit/lib/utils";
import { CircleFadingPlus } from "lucide-react";
import React from "react";

export type SidebarInsertionLineProps = React.HTMLAttributes<HTMLDivElement>;

export const SidebarInsertionLine = React.forwardRef<HTMLDivElement, SidebarInsertionLineProps>(
	({ className, ...props }, ref) => {
		return (
			<div
				data-sidebar="sidebar-insertion-line"
				className={cn(
					"group/insertion relative z-10 flex h-0.5 cursor-pointer flex-row items-center border-none bg-transparent p-0 before:absolute before:-inset-y-1.5 before:inset-x-0 before:content-['']",
					className
				)}
				ref={ref}
				{...props}
			>
				<IconButton
					icon={CircleFadingPlus}
					size="xs"
					className="peer/icon h-4 w-4 p-0.5 text-muted opacity-0 group-hover/insertion:opacity-100"
					variant="link"
					tabIndex={-1}
				/>
				<div className="h-px w-full bg-transparent group-hover/insertion:[background:linear-gradient(90deg,#71717A_0%,rgba(113,113,122,0.00)_100%)] peer-hover/icon:bg-primary-fg peer-hover/icon:[background:none]" />
			</div>
		);
	}
);
SidebarInsertionLine.displayName = "SidebarInsertionLine";
