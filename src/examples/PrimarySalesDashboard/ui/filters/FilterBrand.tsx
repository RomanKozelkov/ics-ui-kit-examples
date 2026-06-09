import { DictionaryFilter } from "../../../../shared/bi-dashboard/filters/DictionaryFilter";
import { fetchBrands } from "../../api/fetchers";
import { primarySalesKeys } from "../../api/queryKeys";
import { useFiltersStore } from "../../stores/useFiltersStore";

export function FilterBrand() {
	const brands = useFiltersStore((s) => s.brands);
	const setBrands = useFiltersStore((s) => s.setBrands);

	return (
		<DictionaryFilter
			label="Бренды"
			value={brands}
			onChange={setBrands}
			queryKey={primarySalesKeys.brands}
			queryFn={fetchBrands}
		/>
	);
}
