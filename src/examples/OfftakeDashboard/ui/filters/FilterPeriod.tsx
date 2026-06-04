import { PeriodFilter } from "../../../../shared/bi-dashboard/filters/PeriodFilter";
import { useFiltersStore, type Period } from "../../stores/useFiltersStore";

export function FilterPeriod() {
	const period = useFiltersStore((s) => s.period);
	const setPeriod = useFiltersStore((s) => s.setPeriod);
	const year = useFiltersStore((s) => s.year);

	return <PeriodFilter period={period} year={year} onChange={(p) => setPeriod(p as Period)} />;
}
