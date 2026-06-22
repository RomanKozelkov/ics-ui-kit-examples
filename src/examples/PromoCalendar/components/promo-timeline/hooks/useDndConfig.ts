import { useMemo } from "react";
import { type Modifier as DndKitModifier, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";

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

	return { modifiers };
}
