type Slottable = { beginIdx: number; endIdx: number; lane: number };

// Greedy interval partitioning — O(n log n). dateEnd inclusive:
// lane is free only when its last endIdx is STRICTLY less than beginIdx of new item.
export function assignLanes<T extends Slottable>(items: T[]): number {
	const sorted = [...items].sort((a, b) => a.beginIdx - b.beginIdx);
	const laneEnds: number[] = [];

	for (const it of sorted) {
		let lane = laneEnds.findIndex((end) => end < it.beginIdx);
		if (lane === -1) lane = laneEnds.length;
		laneEnds[lane] = it.endIdx;
		it.lane = lane;
	}

	return laneEnds.length;
}
