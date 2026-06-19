import { FrostedGlassExample } from "./examples/FrostedGlassExample";
import { LiquidGlassExample } from "./examples/LiquidGlassExample";

export function LiquidGlassEffect() {
	return (
		<div className="flex flex-col gap-12 p-8">
			<FrostedGlassExample />
			<div className="border-t border-secondary-border" />
			<LiquidGlassExample />
		</div>
	);
}
