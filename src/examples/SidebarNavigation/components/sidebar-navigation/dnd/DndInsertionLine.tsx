import { cn } from "ics-ui-kit/lib/utils";
import { IconButton } from "ics-ui-kit/components/button";
import { Circle, Plus } from "lucide-react";
import React from "react";

export const DndInsertionLine = React.forwardRef<HTMLDivElement, { className?: string }>(({ className }, ref) => {
	return (
		<div
			ref={ref}
			data-sidebar="sidebar-insertion-line"
			className={cn(
				"group/insertion absolute inset-x-0 bottom-0 z-10 flex translate-y-1/2 cursor-pointer flex-row items-center border-none bg-transparent p-0",
				className
			)}
		>
			<IconButton icon={Circle} size="xs" variant="link" className="peer/icon h-3 w-3 p-0.5 text-primary-fg" />
			<div className="h-px w-full bg-primary-fg" />
		</div>
	);
});
DndInsertionLine.displayName = "DndInsertionLine";
