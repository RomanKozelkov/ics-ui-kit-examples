import { Badge } from "ics-ui-kit/components/badge";
import { Card } from "ics-ui-kit/components/card";
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

	return (
		<Card className="gap-4 p-4 px-5 !shadow-none">
			<div className="flex flex-col gap-1.5">
				<div className="flex items-center justify-between gap-1.5">
					<div className="text-sm text-secondary-fg">{title}</div>
					{percentage != null && (
						<Badge
							status={positive ? "success" : "error"}
							size="sm"
							startIcon={positive ? TrendingUp : TrendingDown}
						>
							{positive ? "+" : ""}
							{percentage.toFixed(1)}%
						</Badge>
					)}
				</div>
				<SkeletonText
					className="text-2xl font-semibold tabular-nums tracking-tight text-primary-fg"
					loadingClassName="w-32"
					loading={isLoading}
				>
					{value}
				</SkeletonText>
			</div>
			<SkeletonText
				loading={isLoading}
				className="line-clamp-1 text-sm font-medium text-primary-fg"
				loadingClassName="w-40"
			>
				{previousValue}
			</SkeletonText>
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
