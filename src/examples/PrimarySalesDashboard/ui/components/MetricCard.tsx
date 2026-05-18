import { Card } from "ics-ui-kit/components/card";
import { Icon } from "ics-ui-kit/components/icon";
import { cn } from "ics-ui-kit/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";
import { ReactNode } from "react";

type MetricCardProps = {
	title: string;
	value: ReactNode;
	previousValue: ReactNode;
	percentage?: number | null;
	isLoading?: boolean;
};

export const MetricCard = (props: MetricCardProps) => {
	const { title, value, previousValue, percentage, isLoading } = props;
	const positive = percentage != null && percentage >= 0;
	const TrendIcon = positive ? TrendingUp : TrendingDown;

	return (
		<Card className="flex h-[8.125rem] flex-col border-[0.5px] border-primary-border px-5 pb-4 pt-5 shadow-soft-md lg:px-5">
			<div className="text-sm font-normal text-muted">{title}</div>
			<SkeletonText
				className="mt-[1.125rem] text-3xl font-medium tabular-nums leading-none tracking-[-0.06em] text-primary-fg"
				loadingClassName="w-32"
				loading={isLoading}
			>
				{value}
			</SkeletonText>

			<div className="mt-2.5 flex items-center gap-2 text-xs">
				{percentage != null && (
					<div className="flex items-center gap-1">
						<Icon
							icon={TrendIcon}
							className={cn(
								"h-4 w-4 shrink-0",
								positive ? "text-status-success-fg" : "text-status-error-fg"
							)}
						/>
						<span
							className={cn("font-medium", positive ? "text-status-success-fg" : "text-status-error-fg")}
						>
							{positive ? "+" : ""}
							{percentage.toFixed(1)}%
						</span>
					</div>
				)}
				<SkeletonText loading={isLoading} className="text-muted" loadingClassName="w-36">
					{previousValue}
				</SkeletonText>
			</div>
		</Card>
	);
};

type SkeletonTextProps = {
	loading?: boolean;
	className: string;
	loadingClassName: string;
	children: ReactNode;
};

const SkeletonText = ({ loading, className, loadingClassName, children }: SkeletonTextProps) => (
	<div
		className={cn(
			loading ? `text-muted-fg animate-pulse rounded-md bg-secondary-bg-hover ${loadingClassName}` : "",
			className
		)}
	>
		{!loading ? children : <span className="invisible">Loading</span>}
	</div>
);
