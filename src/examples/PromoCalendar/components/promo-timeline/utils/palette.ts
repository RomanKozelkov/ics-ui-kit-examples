const PALETTE = [
	"#5b6cff",
	"#0fb5ba",
	"#f4845f",
	"#9b5de5",
	"#ef476f",
	"#118ab2",
	"#06d6a0",
	"#ffd166"
] as const;

/** Цвет привязан к стабильному id промо, а не к позиции в массиве:
 *  не прыгает при фильтре/reorder/override. */
export function colorForId(id: number): string {
	const hash = Math.abs(Math.trunc(id));
	return PALETTE[hash % PALETTE.length];
}
