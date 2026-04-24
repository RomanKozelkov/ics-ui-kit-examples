import { useFiltersStore } from "../../stores/useFiltersStore";
import { getNumberFormatter } from "../../utils/getNumberFormatter";
import { MetricCard } from "../components/MetricCard";
import { useValueCard } from "./useCardsData";

export function PrimarySalesValueCard() {
	const currency = useFiltersStore((s) => s.currency);
	const year = useFiltersStore((s) => s.year);
	const { data, isLoading } = useValueCard();
	const symbol = currency === "USD" ? "$" : "₽";
	const cf = getNumberFormatter(currency === "USD" ? "en-US" : "ru-RU", {
		style: "currency",
		currency,
		maximumFractionDigits: 0,
		currencyDisplay: "narrowSymbol"
	});

	const value = data ? cf.format(data.current ?? 0) : null;
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
