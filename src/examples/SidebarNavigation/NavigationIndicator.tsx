import { getIndicatorOffset } from "./getIndicatorOffset";

export function NavigationIndicator({ level }: { level: number }) {
	return (
		<span
			className="pointer-events-none absolute top-0 h-full w-0.5 rounded-full bg-primary-accent"
			style={{ left: getIndicatorOffset(level) }}
		/>
	);
}
