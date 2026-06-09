import { cn } from "ics-ui-kit/lib/utils";

interface DashboardHeaderProps extends React.HTMLAttributes<HTMLHeadingElement> {
	children: React.ReactNode;
}

export function DashboardHeader({ children, ...props }: DashboardHeaderProps) {
	return (
		<h1 {...props} className={cn("text-2xl font-semibold tracking-tight text-primary-fg", props.className)}>
			{children}
		</h1>
	);
}
