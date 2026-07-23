import type { MouseEventHandler, TouchEventHandler } from "react";
import { cn } from "ics-ui-kit/lib/utils";

type ResizeHandleProps = {
	onMouseDown: MouseEventHandler<HTMLDivElement>;
	onTouchStart?: TouchEventHandler<HTMLDivElement>;
	onDoubleClick: MouseEventHandler<HTMLDivElement>;
	active?: boolean;
};

export function ResizeHandle({ onMouseDown, onTouchStart, onDoubleClick, active }: ResizeHandleProps) {
	return (
		<div
			onMouseDown={onMouseDown}
			onTouchStart={onTouchStart}
			onDoubleClick={onDoubleClick}
			className={cn(
				"absolute right-0 top-0 h-full w-2 cursor-col-resize touch-none select-none",
				"after:absolute after:right-[3px] after:top-1/2 after:h-4 after:w-[2px] after:-translate-y-1/2 after:rounded-full after:bg-secondary-border after:transition-colors",
				"hover:after:bg-primary",
				active && "after:bg-primary"
			)}
		/>
	);
}
