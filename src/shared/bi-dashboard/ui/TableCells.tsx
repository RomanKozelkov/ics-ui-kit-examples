import { Icon } from "ics-ui-kit/components/icon";
import { cn } from "ics-ui-kit/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

export function YoyCell({ value }: { value: number | null }) {
	if (value == null) return <span className="text-tertiary-fg">—</span>;
	const positive = value >= 0;
	return (
		<span className={cn("font-medium", positive ? "text-status-success-fg" : "text-status-error-fg")}>
			{positive ? "+" : ""}
			{value}%
		</span>
	);
}

export function RankCell({ value }: { value: number | null }) {
	if (value == null || value === 0) return <span className="text-tertiary-fg">—</span>;
	const positive = value > 0;
	return (
		<span
			className={cn(
				"inline-flex items-center gap-0.5 font-medium",
				positive ? "text-status-success-fg" : "text-status-error-fg"
			)}
		>
			<Icon icon={positive ? TrendingUp : TrendingDown} size="sm" />
			{positive ? "+" : ""}
			{value}
		</span>
	);
}
