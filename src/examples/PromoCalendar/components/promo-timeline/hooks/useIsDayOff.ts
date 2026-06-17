import { useMemo } from "react";
import { useHolidaysQuery } from "../../../api/promo.queries";
import { msToISO } from "../utils/date";
import type { IsDayOff } from "../utils/timeline";

/**
 * Единый источник правила «нерабочий день» для таймлайна.
 * Тянет производственный календарь (выходные + праздники) и отдаёт предикат
 * для `getTimelineModel`. Suspense-query — holidays гарантированно есть.
 */
export function useIsDayOff(year: number): IsDayOff {
	const { data: holidays } = useHolidaysQuery({ year });

	return useMemo<IsDayOff>(() => {
		return (ms, dow) => dow === 0 || dow === 6 || holidays.has(msToISO(ms));
	}, [holidays]);
}
