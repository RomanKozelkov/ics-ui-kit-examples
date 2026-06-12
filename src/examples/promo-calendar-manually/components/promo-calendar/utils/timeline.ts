import { dayNumFromISO, MS_DAY } from "./date";

export type TimelineDay = {
	dayIndex: number;
	day: number;
	dow: number; // 0=Sun … 6=Sat (UTC)
	isWeekend: boolean;
};

export type TimelineMonth = {
	key: string; // 'YYYY-MM', month 1-based и с padding — стабильно сортируется
	year: number;
	month: number; // 0-based (как Date.getUTCMonth)
	startIndex: number;
	dayCount: number;
};

export type TimelineModel = {
	days: TimelineDay[];
	months: TimelineMonth[];
	startNum: number;
	totalDays: number;
};

export function getTimelineModel(startISO: string, endISO: string): TimelineModel {
	const days: TimelineDay[] = [];
	const months: TimelineMonth[] = [];
	const startNum = dayNumFromISO(startISO);
	const endNum = dayNumFromISO(endISO);

	let segment: TimelineMonth | null = null;

	// всё выводим из UTC-номера дня — TZ-стабильно, без мутабельного локального Date
	for (let n = startNum; n <= endNum; n++) {
		const idx = n - startNum;
		const d = new Date(n * MS_DAY); // UTC-полночь дня n
		const year = d.getUTCFullYear();
		const month = d.getUTCMonth(); // 0-based
		const dow = d.getUTCDay();
		days.push({ dayIndex: idx, day: d.getUTCDate(), dow, isWeekend: dow === 0 || dow === 6 });

		const key = `${year}-${String(month + 1).padStart(2, "0")}`;
		if (!segment || segment.key !== key) {
			segment = { key, year, month, startIndex: idx, dayCount: 0 };
			months.push(segment);
		}
		segment.dayCount++;
	}

	return { days, months, startNum, totalDays: endNum - startNum + 1 };
}
