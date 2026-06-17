import { MS_DAY } from "./constants";
import { isoToMsUTC, inclusiveEndToExclusiveMs, daysBetween } from "./date";

export type TimelineDay = {
	dayIndex: number;
	day: number;
	dow: number;
	isWeekend: boolean;
	ms: number;
};

export type TimelineMonth = {
	key: string;
	year: number;
	month: number;
	startIndex: number;
	dayCount: number;
};

export type TimelineModel = {
	days: TimelineDay[];
	months: TimelineMonth[];
	startMs: number;
	endMs: number;
	totalDays: number;
};

/**
 * Predicate deciding whether a given day is a day off (non-working).
 * `ms` is the day's UTC midnight timestamp, `dow` is the UTC day of week (0=Sun..6=Sat).
 * Override to plug in a production calendar (holidays, transferred days, working Saturdays).
 */
export type IsDayOff = (ms: number, dow: number) => boolean;

/** Default rule: Saturday and Sunday are days off. */
export const defaultIsDayOff: IsDayOff = (_ms, dow) => dow === 0 || dow === 6;

export function getTimelineModel(
	startISO: string,
	endISO: string,
	isDayOff: IsDayOff = defaultIsDayOff
): TimelineModel {
	const startMs = isoToMsUTC(startISO);
	const endMs = inclusiveEndToExclusiveMs(endISO);
	const totalDays = daysBetween(startMs, endMs);

	const days: TimelineDay[] = [];
	const months: TimelineMonth[] = [];
	let segment: TimelineMonth | null = null;

	for (let i = 0; i < totalDays; i++) {
		const ms = startMs + i * MS_DAY;
		const d = new Date(ms);
		const year = d.getUTCFullYear();
		const month = d.getUTCMonth();
		const dayOfWeek = d.getUTCDay();
		days.push({
			dayIndex: i,
			day: d.getUTCDate(),
			dow: dayOfWeek,
			isWeekend: isDayOff(ms, dayOfWeek),
			ms
		});

		const key = `${year}-${String(month + 1).padStart(2, "0")}`;
		if (!segment || segment.key !== key) {
			segment = { key, year, month, startIndex: i, dayCount: 0 };
			months.push(segment);
		}
		segment.dayCount++;
	}

	return { days, months, startMs, endMs, totalDays };
}
