import type { Metric } from "../../stores/useFiltersStore";
import { useFiltersStore } from "../../stores/useFiltersStore";
import { useMetricFormat } from "../../utils/useMetricFormat";
import { MetricCard } from "../components/MetricCard";
import { useCard } from "./useCardsData";

export function OfftakeCard({ metric }: { metric: Metric }) {
	const year = useFiltersStore((s) => s.year);
	const { data, isStale } = useCard(metric);
	const fmt = useMetricFormat(metric);

	const symbol = fmt.fullParts(0).find((p) => p.type === "currency")?.value ?? "";
	const title = `Offtake, ${symbol || metric}`;

	const value = data ? <MetricValue fmt={fmt} value={data.current ?? 0} /> : null;
	const percentage = data?.yoy;
	const previousValue = data ? `PY (${year - 1}): ${fmt.full(data.previous ?? 0)}` : null;

	return (
		<MetricCard
			title={title}
			value={value}
			percentage={percentage}
			previousValue={previousValue}
			isStale={isStale}
		/>
	);
}

function MetricValue({ fmt, value }: { fmt: ReturnType<typeof useMetricFormat>; value: number }) {
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
