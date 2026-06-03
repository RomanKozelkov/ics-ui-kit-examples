import { useState } from "react";
import { fetchDistributors } from "../../api/fetchers";
import { STALE_TIMES } from "../../api/queryConfig";
import { offtakeKeys } from "../../api/queryKeys";
import { FilterField } from "../components/FilterField";
import { useFiltersStore } from "../../stores/useFiltersStore";
import { useFilterOptions } from "../../../../shared/hooks/useFilterOptions";
import { MultiSelectControlled } from "../../../../shared/components/MultiSelectControlled";

export function FilterDistr() {
	const counterparties = useFiltersStore((s) => s.counterparties);
	const setCounterparties = useFiltersStore((s) => s.setCounterparties);

	const [open, setOpen] = useState(false);
	const { options, isLoading, error, onSearch } = useFilterOptions({
		open,
		queryKey: offtakeKeys.distributors,
		queryFn: fetchDistributors,
		staleTime: STALE_TIMES.dictionaries
	});

	return (
		<FilterField label="Клиенты">
			<MultiSelectControlled
				value={counterparties}
				options={options}
				isLoading={isLoading}
				error={error}
				onChange={setCounterparties}
				onSearch={onSearch}
				open={open}
				onOpenChange={setOpen}
			/>
		</FilterField>
	);
}
