import { Circle } from "lucide-react";
import { Icon } from "ics-ui-kit/components/icon";
import { cn } from "ics-ui-kit/lib/utils";

export function DragInsertionLine({ className }: { className?: string }) {
	return (
		<div
			data-sidebar="drag-insertion-line"
			className={cn(
				"pointer-events-none absolute -left-[3.5px] bottom-0 right-0 z-20 flex h-3 translate-y-1/2 flex-row items-center border-none bg-transparent p-0",
				className
			)}
		>
			<Icon icon={Circle} size="sm" className="h-2 w-2 shrink-0 stroke-[3] text-primary-fg" />
			<div className="h-px w-full rounded-full bg-primary-fg" />
		</div>
	);
}
