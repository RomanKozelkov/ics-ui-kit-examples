import { DictionaryFilter } from "../../../../shared/bi-dashboard/filters/DictionaryFilter";
import { fetchContracts } from "../../api/fetchers";
import { offtakeKeys } from "../../api/queryKeys";
import { useFiltersStore } from "../../stores/useFiltersStore";

export function FilterContract() {
	const contracts = useFiltersStore((s) => s.contracts);
	const setContracts = useFiltersStore((s) => s.setContracts);

	return (
		<DictionaryFilter
			label="Контракт"
			value={contracts}
			onChange={setContracts}
			queryKey={offtakeKeys.contracts}
			queryFn={fetchContracts}
		/>
	);
}
