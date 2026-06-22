import { FrostedGlassExample } from "./examples/FrostedGlassExample";
import { LiquidGlassExample } from "./examples/LiquidGlassExample";
import { SoftEdgesExample } from "./examples/SoftEdgesExample";
import { HookPlaygroundExample } from "./examples/HookPlaygroundExample";

export function LiquidGlassEffect() {
	return (
		<div className="flex flex-col gap-12 p-8">
			<HookPlaygroundExample />
			<div className="border-t border-secondary-border" />
			<FrostedGlassExample />
			<div className="border-t border-secondary-border" />
			<LiquidGlassExample />
			<div className="border-t border-secondary-border" />
			<SoftEdgesExample />
		</div>
	);
}
