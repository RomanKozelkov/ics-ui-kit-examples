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
