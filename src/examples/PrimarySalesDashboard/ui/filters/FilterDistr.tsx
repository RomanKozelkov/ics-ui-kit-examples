import { useQueryClient } from "@tanstack/react-query";
import type { LoadOptionsParams, SearchSelectOption } from "ics-ui-kit/components/search-select";
import { MultiSelect } from "ics-ui-kit/components/search-select";
import { useCallback } from "react";
import { fetchDistributors } from "../../api/fetchers";
import { STALE_TIMES } from "../../api/queryConfig";
import { primarySalesKeys } from "../../api/queryKeys";
import { FilterField } from "../components/FilterField";
import { useFiltersStore } from "../../stores/useFiltersStore";

export function FilterDistr() {
	const queryClient = useQueryClient();
	const loadOptions = useCallback(async (params: LoadOptionsParams) => {
		const options = await queryClient.fetchQuery({
			queryKey: primarySalesKeys.distributors(params.searchQuery),
			queryFn: () => fetchDistributors(params.searchQuery),
			staleTime: STALE_TIMES.dictionaries
		});
		return { options };
	}, []);

	const counterparties = useFiltersStore((s) => s.counterparties);
	const setCounterparties = useFiltersStore((s) => s.setCounterparties);
	const handleChange = useCallback(
		(options: SearchSelectOption[]) => {
			setCounterparties(options.map((o) => ({ value: String(o.value), label: o.label })));
		},
		[setCounterparties]
	);

	return (
		<FilterField label="Дистрибьюторы">
			<MultiSelect value={counterparties} loadOptions={loadOptions} onChange={handleChange} />
		</FilterField>
	);
}
