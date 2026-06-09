import { DictionaryFilter } from "../../../../shared/bi-dashboard/filters/DictionaryFilter";
import { fetchSalesChannels } from "../../api/fetchers";
import { offtakeKeys } from "../../api/queryKeys";
import { useFiltersStore } from "../../stores/useFiltersStore";

export function FilterSalesChannel() {
	const salesChannels = useFiltersStore((s) => s.salesChannels);
	const setSalesChannels = useFiltersStore((s) => s.setSalesChannels);

	return (
		<DictionaryFilter
			label="Канал продаж"
			value={salesChannels}
			onChange={setSalesChannels}
			queryKey={offtakeKeys.salesChannels}
			queryFn={fetchSalesChannels}
		/>
	);
}
