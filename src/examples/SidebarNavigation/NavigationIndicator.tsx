import { getIndicatorOffset } from "./getIndicatorOffset";

export function NavigationIndicator({ level }: { level: number }) {
	return (
		<span
			className="pointer-events-none absolute top-0 my-0.5 h-6 w-0.5 rounded-xs bg-primary-accent"
			style={{ left: getIndicatorOffset(level) }}
		/>
	);
}
