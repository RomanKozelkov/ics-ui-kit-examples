import { cn } from "ics-ui-kit/lib/utils";
import { CircleFadingPlus, CirclePlus } from "lucide-react";
import { Icon } from "ics-ui-kit/components/icon";

export function InsertionDepthIcon({
	isActive,
	isHidden,
	style
}: {
	isActive: boolean;
	isHidden: boolean;
	style?: React.CSSProperties;
}) {
	return (
		<div className="absolute top-1/2 h-4 w-4 -translate-y-1/2" style={style}>
			<Icon
				icon={isActive ? CirclePlus : CircleFadingPlus}
				size="sm"
				className={cn(
					"insertion-icon absolute h-4 w-4 p-0.5 transition-opacity duration-150",
					isActive ? "text-primary-fg" : "text-primary-border",
					isHidden ? "opacity-0" : "opacity-0 group-hover/insertion:opacity-100"
				)}
			/>
		</div>
	);
}
