import { formatMetric, formatMetricParts, type Metric } from "./metricFormat";

/**
 * Отдаёт набор форматтеров под конкретную метрику (`RUB`/`USD`/`Units`).
 *
 * Хук не знает, откуда взялась метрика — её передаёт вызывающая сторона.
 * Каждый дашборд оборачивает этот хук и подставляет метрику из своего стора,
 * сохраняя единственную ответственность стора (см. `useMetricFormat` в дашборде).
 *
 * Возвращает:
 *  - `compact` — короткий формат (`1,2 млн`) для осей графиков и плотных мест;
 *  - `full` — полный формат (`1 234 567 ₽`) для основных значений;
 *  - `fullParts` — `Intl.NumberFormat.formatToParts` для отдельной стилизации
 *    символа валюты и числовой части.
 */
export const useMetricFormat = (metric: Metric) => ({
	metric,
	compact: (value: number) => formatMetric(value, metric, "compact"),
	full: (value: number) => formatMetric(value, metric, "full"),
	fullParts: (value: number) => formatMetricParts(value, metric, "full")
});
