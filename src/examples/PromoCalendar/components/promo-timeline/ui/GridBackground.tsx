import { useTimelineContext } from "dnd-timeline";
import { MS_DAY, Z_INDEX } from "../utils/constants";
import { todayUTCms } from "../utils/date";
import type { TimelineModel } from "../utils/timeline";

/** День недели по UTC для понедельника (0=Вс..6=Сб); здесь рисуются разделители недель. */
const WEEK_START_DOW = 1;
/** Ширина линии-разделителя недель, px. */
const DIVIDER_W = 1;
/** Ширина линии-маркера «сегодня», px. */
const TODAY_MARKER_W = 2;

type ValueToPixels = ReturnType<typeof useTimelineContext>["valueToPixels"];

/** Затенённые полосы под колонками выходных (нерабочих дней). */
function WeekendBands({ timeline, valueToPixels }: { timeline: TimelineModel; valueToPixels: ValueToPixels }) {
	const dayPx = valueToPixels(MS_DAY);
	return (
		<>
			{timeline.days.map((d) =>
				d.isWeekend ? (
					<div
						key={`w${d.dayIndex}`}
						className="absolute inset-y-0 bg-muted/25"
						style={{ left: valueToPixels(d.dayIndex * MS_DAY), width: dayPx }}
					/>
				) : null
			)}
		</>
	);
}

/** Вертикальные линии в начале каждой недели (понедельник). */
function WeekDividers({ timeline, valueToPixels }: { timeline: TimelineModel; valueToPixels: ValueToPixels }) {
	return (
		<>
			{timeline.days.map((d) =>
				d.dow === WEEK_START_DOW ? (
					<div
						key={`m${d.dayIndex}`}
						className="absolute inset-y-0 border-l border-border/60"
						style={{ left: valueToPixels(d.dayIndex * MS_DAY), width: DIVIDER_W }}
					/>
				) : null
			)}
		</>
	);
}

/** Линия-выделение по центру колонки «сегодня», если сегодня попадает в диапазон. */
function TodayMarker({ timeline, valueToPixels }: { timeline: TimelineModel; valueToPixels: ValueToPixels }) {
	const todayMs = todayUTCms();
	if (todayMs < timeline.startMs || todayMs >= timeline.endMs) return null;

	const dayPx = valueToPixels(MS_DAY);
	const left = valueToPixels(todayMs - timeline.startMs) + dayPx / 2 - TODAY_MARKER_W / 2;
	return <div className="absolute inset-y-0 bg-destructive" style={{ left, width: TODAY_MARKER_W }} />;
}

export function GridBackground({ timeline }: { timeline: TimelineModel }) {
	const { sidebarWidth, valueToPixels } = useTimelineContext();

	return (
		<>
			<div
				aria-hidden
				// Z.grid (0, не 1): сетка в одном слое с промо (itemStyle z=auto), но раньше в DOM —
				// значит под промо. Выше фоновой заливки строки, поэтому полосы выходных видны.
				className="pointer-events-none absolute inset-y-0"
				style={{ left: sidebarWidth, right: 0, zIndex: Z_INDEX.grid }}
			>
				<WeekendBands timeline={timeline} valueToPixels={valueToPixels} />
				<WeekDividers timeline={timeline} valueToPixels={valueToPixels} />
			</div>
			{/* Маркер «сегодня» — отдельный слой: z=grid создаёт контекст наложения, поэтому
			    из общего контейнера линию не поднять над промо. Отдельный overlay с z=today. */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-y-0"
				style={{ left: sidebarWidth, right: 0, zIndex: Z_INDEX.today }}
			>
				<TodayMarker timeline={timeline} valueToPixels={valueToPixels} />
			</div>
		</>
	);
}
