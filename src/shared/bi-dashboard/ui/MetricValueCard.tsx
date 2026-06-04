import type { Metric, useMetricFormat } from "../format";
import { MetricCard } from "./MetricCard";

/** Значения метрики за текущий/прошлый год + YoY. Считается в `useCard` каждого дашборда. */
export type CardView = {
	current: number | null;
	previous: number | null;
	yoy: number | null;
};

type MetricFormat = ReturnType<typeof useMetricFormat>;

type MetricValueCardProps = {
	/** Префикс заголовка карточки, напр. `"Primary Sales"`. Валюта/метрика добавляется автоматически. */
	label: string;
	/** Текущий выбранный год — для подписи прошлого года (`PY (2024): …`). */
	year: number;
	/** Метрика, под которую отформатированы значения. */
	metric: Metric;
	/** Форматтеры под `metric` (из `useMetricFormat` дашборда). */
	fmt: MetricFormat;
	card: CardView | undefined;
	isStale?: boolean;
};

/**
 * Презентационная карточка метрики дашборда: заголовок с символом валюты,
 * крупное значение текущего года, YoY и значение прошлого года.
 *
 * Не знает ни про стор, ни про источник данных — всё приходит пропсами.
 * Стейт (стор/запросы) живёт в тонкой обёртке каждого дашборда.
 */
export function MetricValueCard({ label, year, metric, fmt, card, isStale }: MetricValueCardProps) {
	const symbol = fmt.fullParts(0).find((p) => p.type === "currency")?.value ?? "";
	const title = `${label}, ${symbol || metric}`;

	const value = card ? <MetricValue fmt={fmt} value={card.current ?? 0} /> : null;
	const previousValue = card ? `PY (${year - 1}): ${fmt.full(card.previous ?? 0)}` : null;

	return (
		<MetricCard
			title={title}
			value={value}
			percentage={card?.yoy}
			previousValue={previousValue}
			isStale={isStale}
		/>
	);
}

function MetricValue({ fmt, value }: { fmt: MetricFormat; value: number }) {
	const parts = fmt.fullParts(value);
	const symbolPart = parts.find((p) => p.type === "currency")?.value ?? "";
	const number = parts
		.filter((p) => p.type !== "currency" && p.type !== "literal")
		.map((p) => p.value)
		.join("");

	if (!symbolPart) return <>{number}</>;

	const symbolFirst = parts[0]?.type === "currency";
	const symbolNode = <span className="text-3xl font-light leading-none text-muted">{symbolPart}</span>;

	return (
		<span className="inline-flex items-baseline gap-2">
			{symbolFirst ? symbolNode : number}
			{symbolFirst ? number : symbolNode}
		</span>
	);
}
