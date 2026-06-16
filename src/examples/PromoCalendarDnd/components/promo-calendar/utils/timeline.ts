import { MS_DAY } from "./constants";
import { isoToMsUTC } from "./date";

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

export function getTimelineModel(startISO: string, endISO: string): TimelineModel {
	const startMs = isoToMsUTC(startISO);
	const endMs = isoToMsUTC(endISO);
	const totalDays = Math.round((endMs - startMs) / MS_DAY) + 1;

	const days: TimelineDay[] = [];
	const months: TimelineMonth[] = [];
	let segment: TimelineMonth | null = null;

	for (let i = 0; i < totalDays; i++) {
		const ms = startMs + i * MS_DAY;
		const d = new Date(ms);
		const year = d.getUTCFullYear();
		const month = d.getUTCMonth();
		const dow = d.getUTCDay();
		days.push({ dayIndex: i, day: d.getUTCDate(), dow, isWeekend: dow === 0 || dow === 6, ms });

		const key = `${year}-${String(month + 1).padStart(2, "0")}`;
		if (!segment || segment.key !== key) {
			segment = { key, year, month, startIndex: i, dayCount: 0 };
			months.push(segment);
		}
		segment.dayCount++;
	}

	return { days, months, startMs, endMs: endMs + MS_DAY, totalDays };
}
