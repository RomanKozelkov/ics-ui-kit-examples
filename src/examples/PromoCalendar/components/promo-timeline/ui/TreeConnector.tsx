const LINE_W = 14;
const HALF = LINE_W / 2;

// TODO: прикрутить
export function TreeConnector({
	continuations,
	isLast,
	isFirstRow
}: {
	continuations: boolean[];
	isLast: boolean;
	isFirstRow: boolean;
}) {
	const depth = continuations.length;
	if (depth === 0) return null;

	const width = depth * LINE_W;

	return (
		<div className="relative shrink-0" style={{ width }}>
			{continuations.map((cont, col) => {
				const x = col * LINE_W + HALF;
				const isCurrentCol = col === depth - 1;

				if (!isCurrentCol) {
					return cont ? (
						<div key={col} className="absolute w-px bg-border" style={{ left: x, top: 0, bottom: 0 }} />
					) : null;
				}

				// Current connector column (depth - 1)
				if (isFirstRow) {
					return (
						<div key={col}>
							{/* Top half vertical */}
							<div className="absolute w-px bg-border" style={{ left: x, top: 0, height: "50%" }} />
							{/* Bottom half vertical (only if not last) */}
							{!isLast && (
								<div className="absolute w-px bg-border" style={{ left: x, top: "50%", bottom: 0 }} />
							)}
							{/* Horizontal elbow */}
							<div className="absolute h-px bg-border" style={{ left: x, top: "50%", right: 0 }} />
						</div>
					);
				}

				// Non-first row: full vertical if not last, nothing if last
				return !isLast ? (
					<div key={col} className="absolute w-px bg-border" style={{ left: x, top: 0, bottom: 0 }} />
				) : null;
			})}
		</div>
	);
}
