import { useFiltersStore } from "../../stores/useFiltersStore";
import { getNumberFormatter } from "../../utils/getNumberFormatter";
import { MetricCard } from "../components/MetricCard";
import { useUnitsCard } from "./useCardsData";

const nf = getNumberFormatter("ru-RU");

export function PrimarySalesUnitsCard() {
	const year = useFiltersStore((s) => s.year);
	const { data, isLoading } = useUnitsCard();

	const value = data ? nf.format(data.current ?? 0) : null;
	const percentage = data?.yoy;
	const previousValue = data ? `PY (${year - 1}): ${nf.format(data.previous ?? 0)}` : null;

	return (
		<MetricCard
			title="Primary Sales, Units"
			value={value}
			percentage={percentage}
			previousValue={previousValue}
			isLoading={isLoading}
		/>
	);
}
