import { Card } from "ics-ui-kit/components/card";
import { Icon } from "ics-ui-kit/components/icon";
import { cn } from "ics-ui-kit/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";
import { ReactNode } from "react";
import { StaleOverlay } from "../../../../shared/components/StaleOverlay";

type MetricCardProps = {
	title: string;
	value: ReactNode;
	previousValue: ReactNode;
	percentage?: number | null;
	isStale?: boolean;
};

export const MetricCard = (props: MetricCardProps) => {
	const { title, value, previousValue, percentage, isStale } = props;
	const positive = percentage != null && percentage >= 0;
	const TrendIcon = positive ? TrendingUp : TrendingDown;

	return (
		<Card className="flex h-[8.125rem] flex-col border-[0.5px] border-primary-border px-5 pb-4 pt-5 shadow-soft-md lg:px-5">
			<div className="text-sm font-normal text-muted">{title}</div>
			<StaleOverlay isStale={!!isStale}>
				<div className="mt-[1.125rem] text-3xl font-medium tabular-nums leading-none tracking-[-0.06em] text-primary-fg">
					{value}
				</div>

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
								className={cn(
									"font-medium",
									positive ? "text-status-success-fg" : "text-status-error-fg"
								)}
							>
								{positive ? "+" : ""}
								{percentage.toFixed(1)}%
							</span>
						</div>
					)}
					<div className="text-muted">{previousValue}</div>
				</div>
			</StaleOverlay>
		</Card>
	);
};
