import type { TimelineDay } from "../utils/timeline";

// Grid color is structural chrome — not a semantic design token
const GRID_LINE = "#e8eaef";

export function GridBackground({ days, dayWidth, height }: { days: TimelineDay[]; dayWidth: number; height: number }) {
	return (
		<div
			aria-hidden
			className="pointer-events-none absolute inset-0"
			style={{
				width: days.length * dayWidth,
				height,
				backgroundImage: `repeating-linear-gradient(
					to right,
					${GRID_LINE} 0,
					${GRID_LINE} 1px,
					transparent 1px,
					transparent ${dayWidth}px
				)`
			}}
		>
			{days.map((d) =>
				d.isWeekend ? (
					<div
						key={d.dayIndex}
						className="absolute top-0 bg-muted/25"
						style={{ left: d.dayIndex * dayWidth, width: dayWidth, height }}
					/>
				) : null
			)}
		</div>
	);
}
