import { DictionaryFilter } from "../../../../shared/bi-dashboard/filters/DictionaryFilter";
import { fetchDistributors } from "../../api/fetchers";
import { offtakeKeys } from "../../api/queryKeys";
import { useFiltersStore } from "../../stores/useFiltersStore";

export function FilterDistr() {
	const counterparties = useFiltersStore((s) => s.counterparties);
	const setCounterparties = useFiltersStore((s) => s.setCounterparties);

	return (
		<DictionaryFilter
			label="Клиенты"
			value={counterparties}
			onChange={setCounterparties}
			queryKey={offtakeKeys.distributors}
			queryFn={fetchDistributors}
		/>
	);
}
