import type { ReactNode } from "react";
import { cn } from "ics-ui-kit/lib/utils";

type Props = {
	title: ReactNode;
	subtitle?: ReactNode;
	actions?: ReactNode;
	children: ReactNode;
	className?: string;
};

export function DashboardCard({ title, subtitle, actions, children, className }: Props) {
	return (
		<div
			className={cn(
				"rounded-xl border-[0.5px] border-primary-border bg-secondary-bg p-4 px-5 shadow-soft-md",
				className
			)}
		>
			<div className="mb-2 flex items-center justify-between">
				<div>
					<h2 className="text-base font-medium text-primary-fg">{title}</h2>
					{subtitle && <p className="mt-1 text-xs text-secondary-fg">{subtitle}</p>}
				</div>
				{actions}
			</div>
			{children}
		</div>
	);
}
