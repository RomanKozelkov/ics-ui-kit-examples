import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { MultiSelect } from "ics-ui-kit/components/search-select";
import type { LoadOptionsParams, SearchSelectOption } from "ics-ui-kit/components/search-select";
import { useFiltersStore } from "../../stores/useFiltersStore";
import { fetchBrands } from "../../api/fetchers";
import { FilterField } from "../components/FilterField";
import { primarySalesKeys } from "../../api/queryKeys";
import { STALE_TIMES } from "../../api/queryConfig";

export function FilterBrand() {
	const queryClient = useQueryClient();
	const loadOptions = useCallback(async (params: LoadOptionsParams) => {
		const options = await queryClient.fetchQuery({
			queryKey: primarySalesKeys.brands(params.searchQuery),
			queryFn: () => fetchBrands(params.searchQuery),
			staleTime: STALE_TIMES.dictionaries
		});
		return { options };
	}, []);

	const brands = useFiltersStore((s) => s.brands);
	const setBrands = useFiltersStore((s) => s.setBrands);
	const handleChange = useCallback(
		(options: SearchSelectOption[]) => {
			setBrands(options.map((o) => ({ value: String(o.value), label: o.label })));
		},
		[setBrands]
	);

	return (
		<FilterField label="Бренды">
			<MultiSelect value={brands} loadOptions={loadOptions} onChange={handleChange} />
		</FilterField>
	);
}
