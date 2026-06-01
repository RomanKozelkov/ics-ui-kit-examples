import { Circle } from "lucide-react";
import { Icon } from "ics-ui-kit/components/icon";

export function DragInsertionLine() {
	return (
		<div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex translate-y-1/2 flex-row items-center border-none bg-transparent p-0">
			<Icon icon={Circle} size="sm" className="h-2 w-2 shrink-0 text-primary-fg" />
			<div className="h-px w-full bg-primary-fg" />
		</div>
	);
}
