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

export function colorForIndex(i: number): string {
	return PALETTE[i % PALETTE.length];
}
