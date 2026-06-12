import type { TimelineDay } from "../utils/timeline";
import { LEFT_W } from "../utils/constants";

type Props = {
	days: TimelineDay[];
	dayWidth: number;
	todayIndex: number | null;
};

/**
 * Фон сетки таймлайна: выходные (заливка), границы недель (вертикаль на Пн) и today-линия.
 * Смещён на LEFT_W вправо — рисуется только в области дней, за полосками промо (z-1).
 */
export function GridBackground({ days, dayWidth, todayIndex }: Props) {
	return (
		<div aria-hidden className="pointer-events-none absolute inset-y-0 z-[1]" style={{ left: LEFT_W, right: 0 }}>
			{days.map((d) => {
				const left = d.dayIndex * dayWidth;
				if (d.isWeekend) {
					return (
						<div key={`w${d.dayIndex}`} className="absolute inset-y-0 bg-muted/25" style={{ left, width: dayWidth }} />
					);
				}
				if (d.dow === 1) {
					return (
						<div key={`m${d.dayIndex}`} className="absolute inset-y-0 border-l border-border/60" style={{ left, width: 1 }} />
					);
				}
				return null;
			})}
			{todayIndex !== null && (
				<div
					className="absolute inset-y-0 bg-info"
					style={{ left: todayIndex * dayWidth + dayWidth / 2 - 1, width: 2 }}
				/>
			)}
		</div>
	);
}
