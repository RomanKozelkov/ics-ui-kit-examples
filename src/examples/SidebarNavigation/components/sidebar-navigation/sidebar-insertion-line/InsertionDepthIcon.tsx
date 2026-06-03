import { cn } from "ics-ui-kit/lib/utils";
import { CircleFadingPlus, CirclePlus } from "lucide-react";
import { Icon } from "ics-ui-kit/components/icon";

export function InsertionDepthIcon({
	isHidden,
	isPlaceholder,
	isActive,
	style
}: {
	isHidden: boolean;
	isPlaceholder: boolean;
	isActive: boolean;
	style?: React.CSSProperties;
}) {
	return (
		<div
			className="absolute top-1/2 h-3 w-3 -translate-y-1/2 transition-opacity duration-150"
			style={style}
		>
			<Icon
				icon={CircleFadingPlus}
				size="sm"
				className={cn(
					"absolute text-muted",
					isHidden || isActive ? "opacity-0" : "opacity-100",
					isPlaceholder && "text-primary-border"
				)}
			/>
			<Icon
				icon={CirclePlus}
				size="sm"
				className={cn("absolute text-primary-fg", isActive ? "opacity-100" : "opacity-0")}
			/>
		</div>
	);
}
