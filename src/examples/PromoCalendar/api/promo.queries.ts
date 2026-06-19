import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { usePromoCalendarContext } from "../PromoCalendarContext";
import { promoKeys } from "./promo.keys";
import type { PromoCalendarItem } from "./promo.types";

export function useYearsSuspenseQuery() {
	const { api } = usePromoCalendarContext();
	return useSuspenseQuery({
		queryKey: promoKeys.years(),
		queryFn: () => api.fetchYears()
	});
}

export function useHolidaysSuspenseQuery({ year }: { year: number }) {
	const { api } = usePromoCalendarContext();
	// Без select: getHolidays отдаёт Set, RQ кеширует значение — ссылка стабильна между
	// рендерами. Стабильность важна: isDayOff → timeline зависят от holidays (см. useIsDayOff).
	return useSuspenseQuery({
		queryKey: promoKeys.holidays(year),
		queryFn: () => api.getHolidays(year)
	});
}

export function usePromoCalendarSuspenseQuery({ year }: { year: number }) {
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
		mutationFn: (promo: PromoCalendarItem) => api.updatePromo(promo),

		// Оптимистика на UI держится в useOptimistic (см. usePromoOverrides), не в кэше RQ.
		// Здесь только синхронизируем реальную правду: onSuccess пишет подтверждённый promo
		// в кэш ДО того, как резолвится mutateAsync — иначе на конце transition useOptimistic
		// растворится в старые данные и бар прыгнет назад. RQ-колбэки бегут до резолва
		// mutateAsync. Кэш и порт в одном представлении (ISO inclusive) — пишем как есть.
		onSuccess: (_data, promo) => {
			queryClient.setQueryData<PromoCalendarItem[]>(key, (old) =>
				old?.map((p) => (p.id === promo.id ? promo : p))
			);
		},
		// Ошибка: useOptimistic сам откатит UI (кэш оптимистично не трогали — ручной prev не нужен).
		// Инвалидируем — локальный кэш мог разойтись с сервером, тянем правду.
		onError: () => {
			queryClient.invalidateQueries({ queryKey: key });
		}
	});
}

// Create/update/delete без оптимистики: год грузится целиком, после мутации просто
// рефетчим через meta.invalidateKeys (его обрабатывает MutationCache, см. PromoCalendar.tsx).
export function useCreatePromoMutation({ year }: { year: number }) {
	const { api } = usePromoCalendarContext();
	return useMutation({
		mutationFn: (promo: Omit<PromoCalendarItem, "id">) => api.createPromo(promo),
		meta: { invalidateKeys: [promoKeys.fetch(year)] }
	});
}

export function useUpdatePromoMutation({ year }: { year: number }) {
	const { api } = usePromoCalendarContext();
	return useMutation({
		mutationFn: (promo: PromoCalendarItem) => api.updatePromo(promo),
		meta: { invalidateKeys: [promoKeys.fetch(year)] }
	});
}

export function useDeletePromoMutation({ year }: { year: number }) {
	const { api } = usePromoCalendarContext();
	return useMutation({
		mutationFn: (promoId: number) => api.deletePromo(promoId),
		meta: { invalidateKeys: [promoKeys.fetch(year)] }
	});
}
