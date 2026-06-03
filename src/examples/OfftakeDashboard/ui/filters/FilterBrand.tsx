import { useState } from "react";
import { useFiltersStore } from "../../stores/useFiltersStore";
import { fetchBrands } from "../../api/fetchers";
import { FilterField } from "../components/FilterField";
import { offtakeKeys } from "../../api/queryKeys";
import { STALE_TIMES } from "../../api/queryConfig";
import { useFilterOptions } from "../../../../shared/hooks/useFilterOptions";
import { MultiSelectControlled } from "../../../../shared/components/MultiSelectControlled";

export function FilterBrand() {
	const brands = useFiltersStore((s) => s.brands);
	const setBrands = useFiltersStore((s) => s.setBrands);

	const [open, setOpen] = useState(false);
	const { options, isLoading, error, onSearch } = useFilterOptions({
		open,
		queryKey: offtakeKeys.brands,
		queryFn: fetchBrands,
		staleTime: STALE_TIMES.dictionaries
	});

	return (
		<FilterField label="Бренды">
			<MultiSelectControlled
				value={brands}
				options={options}
				isLoading={isLoading}
				error={error}
				onChange={setBrands}
				onSearch={onSearch}
				open={open}
				onOpenChange={setOpen}
			/>
		</FilterField>
	);
}
