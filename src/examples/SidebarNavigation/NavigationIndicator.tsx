import { getIndicatorOffset } from "./getIndicatorOffset";

export function NavigationIndicator({ level }: { level: number }) {
	return (
		<span
			className="pointer-events-none absolute top-0 my-1.5 h-4 w-0.5 rounded-xs bg-primary-accent"
			style={{ left: getIndicatorOffset(level) }}
		/>
	);
}
