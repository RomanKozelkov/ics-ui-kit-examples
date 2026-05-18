import { ReactNode } from "react";
import { useFiltersStore } from "../../stores/useFiltersStore";
import { getNumberFormatter } from "../../utils/getNumberFormatter";
import { MetricCard } from "../components/MetricCard";
import { useValueCard } from "./useCardsData";

export function PrimarySalesValueCard() {
	const currency = useFiltersStore((s) => s.currency);
	const year = useFiltersStore((s) => s.year);
	const { data, isLoading } = useValueCard();
	const isUSD = currency === "USD";
	const symbol = isUSD ? "$" : "₽";
	const cf = getNumberFormatter(isUSD ? "en-US" : "ru-RU", {
		style: "decimal",
		maximumFractionDigits: 0
	});

	const number = data ? cf.format(data.current ?? 0) : null;

	let value: ReactNode | null;
	if (!number) value = null;
	else {
		if (isUSD) {
			value = (
				<>
					<span className="mr-2 text-3xl font-light leading-none text-muted">{symbol}</span>
					{number}
				</>
			);
		} else {
			value = (
				<>
					{number}
					<span className="ml-2 text-3xl font-light leading-none text-muted">{symbol}</span>
				</>
			);
		}
	}

	const percentage = data?.yoy;
	const previousValue = data ? `PY (${year - 1}): ${cf.format(data.previous ?? 0)}` : null;

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
