import { FrostedGlassPlaygroundExample } from "./examples/FrostedGlassPlaygroundExample";
import { LiquidGlassPlaygroundExample } from "./examples/LiquidGlassPlaygroundExample";

export function LiquidGlassEffect() {
	return (
		<div className="flex flex-col gap-12 p-8">
			<FrostedGlassPlaygroundExample />
			<div className="border-t border-secondary-border" />
			<LiquidGlassPlaygroundExample />
		</div>
	);
}
