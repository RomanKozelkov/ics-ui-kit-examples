import { useMetricFormat as useMetricFormatBase } from "../../../shared/bi-dashboard/format";
import { useFiltersStore, type Metric } from "../stores/useFiltersStore";

/**
 * Подписывает компонент на текущую метрику (`RUB`/`USD`/`Units`) из `useFiltersStore`
 * и отдаёт набор форматтеров под неё (см. `useMetricFormat` в `shared/bi-dashboard/format`).
 *
 * `override` отключает подписку на стор и фиксирует метрику принудительно — нужен для
 * карточек, которые показывают конкретную валюту независимо от выбора пользователя.
 */
export const useMetricFormat = (override?: Metric) => {
	const fromStore = useFiltersStore((s) => s.metric);
	return useMetricFormatBase(override ?? fromStore);
};
