import type { TimelineViewport } from "../hooks/useTimelineViewport";

/** Цель скролла для edge-стрелки: ms ближайшего off-screen промо, либо null (стрелки нет). */
export type EdgeTarget = { ms: number } | null;

export type RowEdgeTargets = {
	/** Ближайший промо целиком левее видимого окна. */
	left: EdgeTarget;
	/** Ближайший промо целиком правее видимого окна. */
	right: EdgeTarget;
};

const NONE: RowEdgeTargets = { left: null, right: null };

type EdgeItem = { startMs: number; endMs: number };

/**
 * Какие edge-стрелки показать строке и куда они скроллят.
 *
 * Если хоть один промо пересекает видимое окно — строка не пуста, стрелок нет.
 * Иначе ищем ближайший промо с каждой стороны: слева — с максимальным правым краем,
 * справа — с минимальным левым краем. Цель скролла — startMs найденного промо
 * (центрируется потребителем).
 */
export function rowEdgeTargets(
	items: EdgeItem[],
	view: TimelineViewport,
	toX: (ms: number) => number
): RowEdgeTargets {
	let leftItem: EdgeItem | null = null;
	let leftEndX = -Infinity; // макс endX среди тех, что целиком левее окна
	let rightItem: EdgeItem | null = null;
	let rightStartX = Infinity; // мин startX среди тех, что целиком правее окна

	for (const item of items) {
		const startX = toX(item.startMs);
		const endX = toX(item.endMs);

		// Пересекает видимое окно — строка не пуста, стрелки не нужны.
		if (endX > view.visibleStartX && startX < view.visibleEndX) return NONE;

		if (endX <= view.visibleStartX) {
			if (endX > leftEndX) { leftItem = item; leftEndX = endX; }
		} else {
			if (startX < rightStartX) { rightItem = item; rightStartX = startX; }
		}
	}

	return {
		left: leftItem ? { ms: leftItem.startMs } : null,
		right: rightItem ? { ms: rightItem.startMs } : null
	};
}
