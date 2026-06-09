import { getNumberFormatter } from "./getNumberFormatter";

/** Метрика значения: валюта (`RUB`/`USD`) либо натуральные единицы (`Units`). */
export type Metric = "RUB" | "USD" | "Units";

export type FormatMode = "compact" | "full";

const buildOptions = (metric: Metric, mode: FormatMode): Intl.NumberFormatOptions => {
	const options: Intl.NumberFormatOptions =
		mode === "compact"
			? { notation: "compact", compactDisplay: "short", maximumFractionDigits: 1 }
			: { maximumFractionDigits: 0 };
	if (metric === "Units") return options;
	return { style: "currency", currency: metric, currencyDisplay: "narrowSymbol", ...options };
};

export const formatMetric = (value: number, metric: Metric, mode: FormatMode = "full") =>
	getNumberFormatter(void 0, buildOptions(metric, mode)).format(value);

export const formatMetricParts = (value: number, metric: Metric, mode: FormatMode = "full") =>
	getNumberFormatter(void 0, buildOptions(metric, mode)).formatToParts(value);

export const formatPercent = (value: number, opts: { signed?: boolean } = {}) =>
	getNumberFormatter(void 0, {
		style: "percent",
		signDisplay: opts.signed ? "exceptZero" : "auto",
		maximumFractionDigits: 1
	}).format(value / 100);
