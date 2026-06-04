import { RankingTable } from "../../../../shared/bi-dashboard/datagrids/RankingTable";
import { useTablePrefsStore } from "../../stores/useTablePrefsStore";
import { useRegionsTableView } from "./useRegionsData";
import { useMeasureLabel } from "./useDistributorsData";

export function DataGridTopRegions() {
	const { data, isStale } = useRegionsTableView();
	const measureLabel = useMeasureLabel();
	const pageSize = useTablePrefsStore((s) => s.pageSize);
	const setPageSize = useTablePrefsStore((s) => s.setPageSize);

	return (
		<RankingTable
			title="Топ регионы"
			nameHeader="Регион"
			measureLabel={measureLabel}
			data={data}
			isStale={isStale}
			pageSize={pageSize}
			onPageSizeChange={setPageSize}
		/>
	);
}
