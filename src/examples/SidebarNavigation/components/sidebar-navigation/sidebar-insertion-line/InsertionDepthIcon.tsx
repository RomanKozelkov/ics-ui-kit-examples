import { cn } from "ics-ui-kit/lib/utils";
import { CircleFadingPlus, CirclePlus } from "lucide-react";
import { Icon } from "ics-ui-kit/components/icon";

export function InsertionDepthIcon({
	isHidden,
	isPlaceholder,
	style,
	onClick
}: {
	isHidden: boolean;
	isPlaceholder: boolean;
	style?: React.CSSProperties;
	onClick?: () => void;
}) {
	return (
		<div
			role="button"
			tabIndex={0}
			className={cn(
				"group/depth-icon absolute top-1/2 h-3 w-3 -translate-y-1/2 cursor-pointer transition-opacity duration-150"
			)}
			style={style}
			onClick={onClick}
		>
			<Icon
				icon={CircleFadingPlus}
				size="sm"
				className={cn(
					"absolute h-3 w-3 text-muted group-hover/depth-icon:opacity-0",
					isHidden ? "pointer-events-none opacity-0" : "opacity-100",
					isPlaceholder && "text-primary-border"
				)}
			/>
			<Icon
				icon={CirclePlus}
				size="sm"
				className="absolute h-3 w-3 text-primary-fg opacity-0 group-hover/depth-icon:opacity-100"
			/>
		</div>
	);
}
