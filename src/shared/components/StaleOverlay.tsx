import type { ReactNode } from "react";
import { cn } from "ics-ui-kit/lib/utils";

type Props = {
	isStale: boolean;
	children: ReactNode;
	className?: string;
};

export function StaleOverlay({ isStale, children, className }: Props) {
	return (
		<div className={cn("relative", isStale && "pointer-events-none animate-pulse", className)}>
			<div className={cn(isStale && "opacity-70")}>{children}</div>
		</div>
	);
}
