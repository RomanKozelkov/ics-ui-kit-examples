import { ReactNode } from "react";
import { useFiltersStore } from "../../stores/useFiltersStore";
import { useMetricFormat } from "../../utils/useMetricFormat";
import { MetricCard } from "../components/MetricCard";
import { useValueCard } from "./useCardsData";

export function PrimarySalesValueCard({ currency }: { currency: "RUB" | "USD" }) {
	const year = useFiltersStore((s) => s.year);
	const { data, isLoading } = useValueCard(currency);
	const fmt = useMetricFormat(currency);

	const symbol = fmt.fullParts(0).find((p) => p.type === "currency")?.value ?? "";

	let value: ReactNode | null = null;
	if (data) {
		const parts = fmt.fullParts(data.current ?? 0);
		const number = parts
			.filter((p) => p.type !== "currency" && p.type !== "literal")
			.map((p) => p.value)
			.join("");
		const symbolFirst = parts[0]?.type === "currency";
		const symbolNode = (
			<span className="text-3xl font-light leading-none text-muted">{symbol}</span>
		);
		value = (
			<span className="inline-flex items-baseline gap-2">
				{symbolFirst ? symbolNode : number}
				{symbolFirst ? number : symbolNode}
			</span>
		);
	}

	const percentage = data?.yoy;
	const previousValue = data ? `PY (${year - 1}): ${fmt.full(data.previous ?? 0)}` : null;

	return (
		<MetricCard
			title={`Primary Sales, ${symbol}`}
			value={value}
			percentage={percentage}
			previousValue={previousValue}
			isLoading={isLoading}
		/>
	);
}
