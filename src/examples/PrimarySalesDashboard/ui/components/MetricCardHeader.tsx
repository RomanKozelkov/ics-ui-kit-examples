import type { ReactNode } from "react";
import { Skeleton } from "ics-ui-kit/components/skeleton";

type Props = {
	description: ReactNode;
	title: ReactNode;
	action?: ReactNode;
	isLoading?: boolean;
};

export function MetricCardHeader({ description, title, action, isLoading }: Props) {
	const hasAction = !isLoading && action != null;

	return (
		<div
			className={
				"grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 " +
				(hasAction ? "grid-cols-[1fr_auto]" : "")
			}
		>
			{isLoading ? (
				<>
					<Skeleton className="h-4 w-28" />
					<Skeleton className="h-8 w-32" />
				</>
			) : (
				<>
					<div className="text-sm text-secondary-fg">{description}</div>
					<div className="text-2xl font-semibold tabular-nums tracking-tight text-primary-fg">{title}</div>
					{hasAction && (
						<div
							data-slot="card-action"
							className="col-start-2 row-span-2 row-start-1 self-start justify-self-end"
						>
							{action}
						</div>
					)}
				</>
			)}
		</div>
	);
}
