import { DROP_AFTER_ZONE_RATIO } from "./constants";

// Нижние `ratio` высоты элемента — зона "after" (после), верхняя — "into" (внутрь)
export function getDropMode(
	pointerY: number,
	rect: { top: number; height: number },
	ratio = DROP_AFTER_ZONE_RATIO
): "into" | "after" {
	return pointerY - rect.top > rect.height * ratio ? "after" : "into";
}
