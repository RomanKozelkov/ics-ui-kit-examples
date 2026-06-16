import { useCallback, useMemo, useState } from "react";
import type { PromoData } from "../../../api/promo.queries";
import { MS_DAY } from "../utils/constants";
import { msToISO } from "../utils/date";

type Override = { dateBegin: string; dateEnd: string };

/**
 * Локальные сдвиги промо после drag&drop (id → новые даты), наложенные на данные.
 * Не мутируют серверные данные — живут поверх до релоада query.
 * durationDays/startMs/endMs пересчитываются один раз в useGroupedRows.
 */
export function usePromoOverrides(data: PromoData[] | undefined) {
	const [overrides, setOverrides] = useState<Record<string, Override>>({});

	const items = useMemo<PromoData[]>(() => {
		if (!data) return [];
		return data.map((p) => {
			const o = overrides[p.id];
			return o ? { ...p, ...o } : p;
		});
	}, [data, overrides]);

	const onItemMoved = useCallback((id: string, startMs: number, endMs: number) => {
		setOverrides((prev) => ({
			...prev,
			[id]: { dateBegin: msToISO(startMs), dateEnd: msToISO(endMs - MS_DAY) }
		}));
	}, []);

	return { items, onItemMoved };
}
