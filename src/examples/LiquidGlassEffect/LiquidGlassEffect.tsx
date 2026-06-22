import { FrostedGlassPlaygroundExample } from "./examples/FrostedGlassPlaygroundExample";
import { HookPlaygroundExample } from "./examples/HookPlaygroundExample";

export function LiquidGlassEffect() {
	return (
		<div className="flex flex-col gap-12 p-8">
			<FrostedGlassPlaygroundExample />
			<div className="border-t border-secondary-border" />
			<HookPlaygroundExample />
		</div>
	);
}
