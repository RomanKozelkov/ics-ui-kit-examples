import { FiltersBar } from "../../../../shared/bi-dashboard/ui/FiltersBar";
import { FilterDistr } from "./FilterDistr";
import { FilterBrand } from "./FilterBrand";
import { FilterYear } from "./FilterYear";
import { FilterPeriod } from "./FilterPeriod";
import { FilterMetric } from "./FilterMetric";
import { FilterSource } from "./FilterSource";

export function Filters() {
	return (
		<FiltersBar
			filters={[
				{ node: <FilterDistr />, width: "w-56" },
				{ node: <FilterBrand />, width: "w-56" },
				{ node: <FilterYear /> },
				{ node: <FilterPeriod /> },
				{ node: <FilterMetric /> },
				{ node: <FilterSource /> }
			]}
		/>
	);
}
