import type { TimelineViewport } from "../hooks/useTimelineViewport";

/** Цели edge-стрелок строки: ms ближайшего off-screen промо с каждой стороны (null — стрелки нет). */
export type RowEdges = {
	/** Ближайший промо целиком левее видимого окна. */
	left: number | null;
	/** Ближайший промо целиком правее видимого окна. */
	right: number | null;
};

type EdgeItem = { startMs: number; endMs: number };

/**
 * Снапшот edge-стрелок строки как ПРИМИТИВ `"leftMs:rightMs"` (пустая сторона — без числа).
 *
 * Строка (не объект) специально: useSyncExternalStore сравнивает снапшоты через Object.is,
 * поэтому стабильный примитив не триггерит ре-рендер строки, пока цели стрелок не сменились.
 * Это и есть то, что держит скролл дешёвым при многих строках.
 *
 * Логика: если хоть один промо пересекает видимое окно — строка не пуста, стрелок нет (`""`).
 * Иначе ближайший слева — с максимальным правым краем, справа — с минимальным левым краем;
 * цель скролла — startMs найденного промо (центрируется потребителем).
 */
export function rowEdgeKey(items: EdgeItem[], view: TimelineViewport | null, toX: (ms: number) => number): string {
	if (!view) return ""; // ещё не измерено — стрелок нет

	let leftItem: EdgeItem | null = null;
	let leftEndX = -Infinity; // макс endX среди тех, что целиком левее окна
	let rightItem: EdgeItem | null = null;
	let rightStartX = Infinity; // мин startX среди тех, что целиком правее окна

	for (const item of items) {
		const startX = toX(item.startMs);
		const endX = toX(item.endMs);

		// Пересекает видимое окно — строка не пуста, стрелки не нужны.
		if (endX > view.visibleStartX && startX < view.visibleEndX) return "";

		if (endX <= view.visibleStartX) {
			if (endX > leftEndX) {
				leftItem = item;
				leftEndX = endX;
			}
		} else {
			if (startX < rightStartX) {
				rightItem = item;
				rightStartX = startX;
			}
		}
	}

	return `${leftItem ? leftItem.startMs : ""}:${rightItem ? rightItem.startMs : ""}`;
}

/** Разбирает снапшот `rowEdgeKey` обратно в ms-цели стрелок. */
export function parseEdgeKey(key: string): RowEdges {
	const sep = key.indexOf(":");
	if (sep === -1) return { left: null, right: null };
	const left = key.slice(0, sep);
	const right = key.slice(sep + 1);
	return { left: left ? Number(left) : null, right: right ? Number(right) : null };
}
