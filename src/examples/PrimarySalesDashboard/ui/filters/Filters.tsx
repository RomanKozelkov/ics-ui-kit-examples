import { FilterDistr } from "./FilterDistr";
import { FilterBrand } from "./FilterBrand";
import { FilterYear } from "./FilterYear";
import { FilterPeriod } from "./FilterPeriod";
import { FilterMetric } from "./FilterMetric";
import { FilterCurrency } from "./FilterCurrency";
import { FilterSource } from "./FilterSource";

export function Filters() {
	return (
		<div className="flex w-full flex-col gap-4">
			<FilterDistr />
			<FilterBrand />
			<FilterYear />
			<FilterPeriod />
			<FilterMetric />
			<FilterCurrency />
			<FilterSource />
		</div>
	);
}
