import { useMemo } from "react";
import { type Modifier as DndKitModifier, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";

const DRAG_ACTIVATION_PX = 5;
/** Тач: задержка удержания (мс) до старта драга. Даёт прокрутке пройти, не превращаясь в драг. */
const TOUCH_ACTIVATION_DELAY_MS = 200;
const TOUCH_ACTIVATION_TOLERANCE_PX = 8;

/**
 * Sensors: порог активации отделяет клик от драга — без него dnd-kit глушит трейлинг-click.
 * Modifier: снап по оси X шагами dayWidth (как Notion), y фиксирован в 0.
 */
export function useDndConfig(dayWidth: number) {
	const modifiers = useMemo<DndKitModifier[]>(
		() => [
			({ transform }) => ({
				...transform,
				x: Math.round(transform.x / dayWidth) * dayWidth,
				y: 0
			})
		],
		[dayWidth]
	);

	const sensors = useSensors(
		useSensor(MouseSensor, { activationConstraint: { distance: DRAG_ACTIVATION_PX } }),
		useSensor(TouchSensor, {
			activationConstraint: {
				delay: TOUCH_ACTIVATION_DELAY_MS,
				tolerance: TOUCH_ACTIVATION_TOLERANCE_PX
			}
		})
	);

	return { sensors, modifiers };
}
