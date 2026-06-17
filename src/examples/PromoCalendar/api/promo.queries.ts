import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { usePromoCalendarContext } from "../PromoCalendarContext";
import { promoKeys } from "./promo.keys";
import type { PromoCalendarItem } from "./promo.types";

export function useYearsQuery() {
	const { api } = usePromoCalendarContext();
	return useQuery({
		queryKey: promoKeys.years(),
		queryFn: () => api.fetchYears()
	});
}

export function useHolidaysQuery({ year }: { year: number }) {
	const { api } = usePromoCalendarContext();
	// Без select: getHolidays отдаёт Set, RQ кеширует значение — ссылка стабильна между
	// рендерами. Стабильность важна: isDayOff → timeline зависят от holidays (см. useIsDayOff).
	return useSuspenseQuery({
		queryKey: promoKeys.holidays(year),
		queryFn: () => api.getHolidays(year)
	});
}

export function usePromoCalendarQuery({ year }: { year: number }) {
	const { api } = usePromoCalendarContext();
	return useSuspenseQuery({
		queryKey: promoKeys.fetch(year),
		queryFn: () => api.fetchPromoCalendar(year)
	});
}

export function useChangePromoPeriodMutation({ year }: { year: number }) {
	const { api } = usePromoCalendarContext();
	const queryClient = useQueryClient();
	const key = promoKeys.fetch(year);

	return useMutation({
		mutationFn: ({ promoId, dateBegin, dateEnd }: { promoId: number; dateBegin: string; dateEnd: string }) =>
			api.changePromoPeriod(promoId, dateBegin, dateEnd),

		// Оптимистика на UI держится в useOptimistic (см. usePromoOverrides), не в кэше RQ.
		// Здесь только синхронизируем реальную правду: onSuccess пишет подтверждённый span
		// в кэш ДО того, как резолвится mutateAsync — иначе на конце transition useOptimistic
		// растворится в старые данные и бар прыгнет назад. RQ-колбэки бегут до резолва
		// mutateAsync. Кэш и порт в одном представлении (ISO inclusive) — пишем span как есть.
		onSuccess: (_data, { promoId, dateBegin, dateEnd }) => {
			queryClient.setQueryData<PromoCalendarItem[]>(key, (old) =>
				old?.map((p) => (p.id === promoId ? { ...p, dateBegin, dateEnd } : p))
			);
		},
		// Ошибка: useOptimistic сам откатит UI (кэш оптимистично не трогали — ручной prev не нужен).
		// Инвалидируем — локальный кэш мог разойтись с сервером, тянем правду.
		onError: () => {
			queryClient.invalidateQueries({ queryKey: key });
		}
	});
}
