import { FilterDistr } from "./FilterDistr";
import { FilterBrand } from "./FilterBrand";
import { FilterYear } from "./FilterYear";
import { FilterPeriod } from "./FilterPeriod";
import { FilterMetric } from "./FilterMetric";
import { FilterCurrency } from "./FilterCurrency";
import { FilterSource } from "./FilterSource";

export function Filters() {
	return (
		<div className="grid grid-cols-[repeat(auto-fit,minmax(8rem,1fr))] gap-4 [grid-auto-flow:dense]">
			<div className="col-span-2">
				<FilterDistr />
			</div>
			<div className="col-span-2">
				<FilterBrand />
			</div>
			<div>
				<FilterYear />
			</div>
			<div>
				<FilterPeriod />
			</div>
			<div>
				<FilterMetric />
			</div>
			<div>
				<FilterCurrency />
			</div>
			<div>
				<FilterSource />
			</div>
		</div>
	);
}
