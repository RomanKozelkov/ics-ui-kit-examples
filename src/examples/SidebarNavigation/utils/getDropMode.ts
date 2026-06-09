import { DROP_AFTER_ZONE_PX } from "./constants";

// Последние DROP_AFTER_ZONE_PX пикселей элемента — зона "after", остальное — "into"
export function getDropMode(
	pointerY: number,
	rect: { top: number; height: number },
	afterZonePx = DROP_AFTER_ZONE_PX
): "into" | "after" {
	return pointerY - rect.top >= rect.height - afterZonePx ? "after" : "into";
}
