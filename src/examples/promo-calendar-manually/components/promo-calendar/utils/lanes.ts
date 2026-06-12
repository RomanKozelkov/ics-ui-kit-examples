type Slottable = { beginIdx: number; endIdx: number };

/**
 * Greedy interval partitioning — O(n log n). endIdx inclusive, поэтому дорожка свободна,
 * только если её последний endIdx СТРОГО меньше beginIdx новой полоски.
 * Сортировка по beginIdx ⇒ более раннее промо попадает в дорожку с меньшим индексом
 * ⇒ рисуется выше («выше та, что раньше»).
 */
export function assignLanes<T extends Slottable>(items: T[]): T[][] {
	const sorted = [...items].sort((a, b) => a.beginIdx - b.beginIdx);
	const lanes: { end: number; items: T[] }[] = [];

	for (const it of sorted) {
		const lane = lanes.find((l) => l.end < it.beginIdx);
		if (lane) {
			lane.items.push(it);
			lane.end = it.endIdx;
		} else {
			lanes.push({ end: it.endIdx, items: [it] });
		}
	}

	return lanes.map((l) => l.items);
}
