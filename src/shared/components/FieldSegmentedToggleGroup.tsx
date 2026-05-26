import { useId, type ComponentPropsWithoutRef } from "react";
import { SegmentedToggleGroup } from "./SegmentedToggle";

type GroupProps = ComponentPropsWithoutRef<typeof SegmentedToggleGroup>;

type FieldSegmentedToggleGroupProps = GroupProps & {
	label: React.ReactNode;
};

export function FieldSegmentedToggleGroup({
	label,
	children,
	...groupProps
}: FieldSegmentedToggleGroupProps) {
	const labelId = useId();

	return (
		<div className="flex flex-col gap-2">
			<span id={labelId} className="text-sm font-medium leading-none text-primary-fg">
				{label}
			</span>
			<SegmentedToggleGroup aria-labelledby={labelId} {...groupProps}>
				{children}
			</SegmentedToggleGroup>
		</div>
	);
}
