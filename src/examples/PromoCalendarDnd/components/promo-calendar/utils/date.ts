import { MS_DAY } from "./constants";

export function dayNum(year: number, month: number, day: number): number {
	return Math.floor(Date.UTC(year, month - 1, day) / MS_DAY);
}

export function dayNumFromDate(d: Date): number {
	return Math.floor(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) / MS_DAY);
}

export function dayNumFromISO(iso: string): number {
	const [year, month, day] = iso.split("-").map(Number);
	return dayNum(year, month, day);
}

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
