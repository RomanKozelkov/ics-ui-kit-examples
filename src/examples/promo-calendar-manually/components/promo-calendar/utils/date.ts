export const MS_DAY = 86_400_000;

/**
 * UTC-стабильный «номер дня» — целое число суток от эпохи.
 * Иммунен к DST: одинаков в любой таймзоне.
 * ВНИМАНИЕ: month здесь 1-based (человеческий, как в ISO 'YYYY-MM-DD').
 */
export function dayNum(year: number, month: number, day: number): number {
	return Math.floor(Date.UTC(year, month - 1, day) / MS_DAY);
}

/**
 * Номер дня из Date. Трактует календарную дату как UTC,
 * чтобы совпадать с dayNumFromISO (а не зависеть от локали раннера).
 * Передавайте Date, у которого важна именно дата, не время.
 */
export function dayNumFromDate(d: Date): number {
	return Math.floor(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) / MS_DAY);
}

export function dayNumFromISO(iso: string): number {
	const [year, month, day] = iso.split("-").map(Number);
	return dayNum(year, month, day);
}

/** UTC-номер сегодняшнего дня. Для акцентной today-линии в сетке. */
export function todayDayNum(): number {
	return dayNumFromDate(new Date());
}
