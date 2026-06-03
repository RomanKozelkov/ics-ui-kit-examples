import { useState } from "react";
import { useFiltersStore } from "../../stores/useFiltersStore";
import { fetchSalesChannels } from "../../api/fetchers";
import { FilterField } from "../components/FilterField";
import { offtakeKeys } from "../../api/queryKeys";
import { STALE_TIMES } from "../../api/queryConfig";
import { useFilterOptions } from "../../../../shared/hooks/useFilterOptions";
import { MultiSelectControlled } from "../../../../shared/components/MultiSelectControlled";

export function FilterSalesChannel() {
	const salesChannels = useFiltersStore((s) => s.salesChannels);
	const setSalesChannels = useFiltersStore((s) => s.setSalesChannels);

	const [open, setOpen] = useState(false);
	const { options, isLoading, error, onSearch } = useFilterOptions({
		open,
		queryKey: offtakeKeys.salesChannels,
		queryFn: fetchSalesChannels,
		staleTime: STALE_TIMES.dictionaries
	});

	return (
		<FilterField label="Канал продаж">
			<MultiSelectControlled
				value={salesChannels}
				options={options}
				isLoading={isLoading}
				error={error}
				onChange={setSalesChannels}
				onSearch={onSearch}
				open={open}
				onOpenChange={setOpen}
			/>
		</FilterField>
	);
}
