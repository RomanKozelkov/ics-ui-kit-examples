import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef } from "react";
import { ToggleGroup, ToggleGroupItem } from "ics-ui-kit/components/toggle-group";
import { Divider } from "ics-ui-kit/components/divider";
import { cn } from "ics-ui-kit/lib/utils";

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

type GroupProps = DistributiveOmit<ComponentPropsWithoutRef<typeof ToggleGroup>, "variant" | "size">;

export const SegmentedToggleGroup = forwardRef<ComponentRef<typeof ToggleGroup>, GroupProps>(
	({ className, ...props }, ref) => (
		<ToggleGroup
			ref={ref}
			variant="ghost"
			size="md"
			className={cn(
				"w-fit gap-0 rounded-lg border border-secondary-border shadow-soft-sm",
				"[&>button:first-child]:rounded-l-md [&>button:last-child]:rounded-r-md",
				"[&>:first-child>button]:rounded-l-md [&>:last-child>button]:rounded-r-md",
				className
			)}
			{...(props as ComponentPropsWithoutRef<typeof ToggleGroup>)}
		/>
	)
);
SegmentedToggleGroup.displayName = "SegmentedToggleGroup";

type ItemProps = ComponentPropsWithoutRef<typeof ToggleGroupItem>;

export const SegmentedToggleItem = forwardRef<ComponentRef<typeof ToggleGroupItem>, ItemProps>(
	({ className, ...props }, ref) => (
		<ToggleGroupItem ref={ref} className={cn("h-auto rounded-none", className)} {...props} />
	)
);
SegmentedToggleItem.displayName = "SegmentedToggleItem";

export function SegmentedToggleDivider() {
	return <Divider className="h-[34px]" orientation="vertical" />;
}
