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
				"group/depth-icon absolute top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer transition-opacity duration-150"
			)}
			style={style}
			onClick={onClick}
		>
			<Icon
				icon={CircleFadingPlus}
				size="sm"
				className={cn(
					"insertion-icon absolute h-4 w-4 p-0.5 text-muted group-hover/depth-icon:opacity-0",
					isHidden ? "pointer-events-none opacity-0" : "opacity-100",
					isPlaceholder && "text-primary-border"
				)}
			/>
			<Icon
				icon={CirclePlus}
				size="sm"
				className="insertion-icon absolute h-4 w-4 p-0.5 text-primary-fg opacity-0 group-hover/depth-icon:opacity-100"
			/>
		</div>
	);
}
