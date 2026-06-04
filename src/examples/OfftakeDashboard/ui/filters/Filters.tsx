import { FiltersBar } from "../../../../shared/bi-dashboard/ui/FiltersBar";
import { FilterDistr } from "./FilterDistr";
import { FilterBrand } from "./FilterBrand";
import { FilterYear } from "./FilterYear";
import { FilterPeriod } from "./FilterPeriod";
import { FilterMetric } from "./FilterMetric";
import { FilterSource } from "./FilterSource";
import { FilterContract } from "./FilterContract";
import { FilterSalesChannel } from "./FilterSalesChannel";

const W = "w-44";

export function Filters() {
	return (
		<FiltersBar
			filters={[
				{ node: <FilterDistr />, width: W },
				{ node: <FilterContract />, width: W },
				{ node: <FilterSalesChannel />, width: W },
				{ node: <FilterBrand />, width: W },
				{ node: <FilterYear /> },
				{ node: <FilterPeriod /> },
				{ node: <FilterMetric /> },
				{ node: <FilterSource /> }
			]}
		/>
	);
}
