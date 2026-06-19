import { MS_DAY } from "./constants";

export function isoToMsUTC(iso: string): number {
	const [year, month, day] = iso.split("-").map(Number);
	return Date.UTC(year, month - 1, day);
}

export function msToISO(ms: number): string {
	const d = new Date(ms);
	const y = d.getUTCFullYear();
	const m = String(d.getUTCMonth() + 1).padStart(2, "0");
	const day = String(d.getUTCDate()).padStart(2, "0");
	return `${y}-${m}-${day}`;
}

export function todayUTCms(): number {
	const now = new Date();
	return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
}

export function daysBetween(startMs: number, endMs: number): number {
	return Math.round((endMs - startMs) / MS_DAY);
}

/**
 * Промо-даты приходят inclusive (dateEnd — последний день промо включительно).
 * Внутри таймлайна диапазоны храним exclusive (end не входит) — так считается
 * длительность и позиция. Эти две функции — единственная точка конвертации.
 */
export function inclusiveEndToExclusiveMs(iso: string): number {
	return isoToMsUTC(iso) + MS_DAY;
}

export function exclusiveMsToInclusiveISO(ms: number): string {
	return msToISO(ms - MS_DAY);
}

/** ISO YYYY-MM-DD → dd.mm.yyyy. */
export function isoToDdMmYyyy(iso: string): string {
	const [year, month, day] = iso.split("-");
	return `${day}.${month}.${year}`;
}

const MONTHS_SHORT_RU = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];

/** ms (UTC-полночь) → краткая метка дня для ресайз-подсказки, напр. «16 дек». */
export function msToDayLabel(ms: number): string {
	const d = new Date(ms);
	return `${d.getUTCDate()} ${MONTHS_SHORT_RU[d.getUTCMonth()]}`;
}
