import { cn } from "ics-ui-kit/lib/utils";

interface ComponentPreviewProps {
	children: React.ReactNode;
	classNames?: string;
}

export function ComponentPreview({
	children,
	classNames
}: ComponentPreviewProps) {
	return (
		<div
			className={cn(
				"rounded-none p-0 border border-secondary-border bg-background",
				classNames
			)}
		>
			{children}
		</div>
	);
}
