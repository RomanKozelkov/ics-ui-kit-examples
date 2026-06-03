import { useFiltersStore, type Metric } from "../stores/useFiltersStore";
import { formatMetric, formatMetricParts } from "./metricFormat";

/**
 * Подписывает компонент на текущую метрику (`RUB`/`USD`/`Units`) из `useFiltersStore`
 * и отдаёт набор форматтеров под неё — при переключении метрики компонент перерендерится
 * с новым символом валюты и правилами форматирования.
 *
 * `override` отключает подписку на стор и фиксирует метрику принудительно — нужен для
 * карточек, которые показывают конкретную валюту независимо от выбора пользователя.
 *
 * Возвращает:
 *  - `compact` — короткий формат (`1,2 млн`) для осей графиков и плотных мест;
 *  - `full` — полный формат (`1 234 567 ₽`) для основных значений;
 *  - `fullParts` — `Intl.NumberFormat.formatToParts` для отдельной стилизации
 *    символа валюты и числовой части.
 */
export const useMetricFormat = (override?: Metric) => {
	const fromStore = useFiltersStore((s) => s.metric);
	const metric = override ?? fromStore;
	return {
		metric,
		compact: (value: number) => formatMetric(value, metric, "compact"),
		full: (value: number) => formatMetric(value, metric, "full"),
		fullParts: (value: number) => formatMetricParts(value, metric, "full")
	};
};
