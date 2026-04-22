import type { ReactNode } from "react";
import { Skeleton } from "ics-ui-kit/components/skeleton";

type Props = {
	children: ReactNode;
	isLoading?: boolean;
};

export function MetricCardFooter({ children, isLoading }: Props) {
	if (isLoading) {
		return (
			<div className="flex flex-col items-start gap-1.5 text-sm">
				<Skeleton className="h-4 w-40" />
				<Skeleton className="h-4 w-48" />
			</div>
		);
	}

	return (
		<div className="flex flex-col items-start gap-1.5 text-sm">
			<div className="line-clamp-1 font-medium text-primary-fg">{children}</div>
		</div>
	);
}
