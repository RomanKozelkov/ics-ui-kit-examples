import { useState } from "react";
import { useFiltersStore } from "../../stores/useFiltersStore";
import { fetchContracts } from "../../api/fetchers";
import { FilterField } from "../components/FilterField";
import { offtakeKeys } from "../../api/queryKeys";
import { STALE_TIMES } from "../../api/queryConfig";
import { useFilterOptions } from "../../../../shared/hooks/useFilterOptions";
import { MultiSelectControlled } from "../../../../shared/components/MultiSelectControlled";

export function FilterContract() {
	const contracts = useFiltersStore((s) => s.contracts);
	const setContracts = useFiltersStore((s) => s.setContracts);

	const [open, setOpen] = useState(false);
	const { options, isLoading, error, onSearch } = useFilterOptions({
		open,
		queryKey: offtakeKeys.contracts,
		queryFn: fetchContracts,
		staleTime: STALE_TIMES.dictionaries
	});

	return (
		<FilterField label="Контракт">
			<MultiSelectControlled
				value={contracts}
				options={options}
				isLoading={isLoading}
				error={error}
				onChange={setContracts}
				onSearch={onSearch}
				open={open}
				onOpenChange={setOpen}
			/>
		</FilterField>
	);
}
