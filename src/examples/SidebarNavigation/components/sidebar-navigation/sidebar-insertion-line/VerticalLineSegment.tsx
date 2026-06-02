import { cn } from "ics-ui-kit/lib/utils";

export function VerticalLineSegment({ className }: { className?: string }) {
	return (
		<span
			className={cn(
				"pointer-events-none absolute -top-0.5 bottom-0 left-[0.5px] z-10 w-px bg-primary-border",
				className
			)}
		/>
	);
}
