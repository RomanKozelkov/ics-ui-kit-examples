import { DictionaryFilter } from "../../../../shared/bi-dashboard/filters/DictionaryFilter";
import { fetchDistributors } from "../../api/fetchers";
import { primarySalesKeys } from "../../api/queryKeys";
import { useFiltersStore } from "../../stores/useFiltersStore";

export function FilterDistr() {
	const counterparties = useFiltersStore((s) => s.counterparties);
	const setCounterparties = useFiltersStore((s) => s.setCounterparties);

	return (
		<DictionaryFilter
			label="Дистрибьюторы"
			value={counterparties}
			onChange={setCounterparties}
			queryKey={primarySalesKeys.distributors}
			queryFn={fetchDistributors}
		/>
	);
}
