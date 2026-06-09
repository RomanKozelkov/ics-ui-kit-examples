import { RankingTable } from "../../../../shared/bi-dashboard/datagrids/RankingTable";
import { useTablePrefsStore } from "../../stores/useTablePrefsStore";
import { useDistributorsTableView, useMeasureLabel } from "./useDistributorsData";

export function DataGridTopDistributors() {
	const { data, isStale } = useDistributorsTableView();
	const measureLabel = useMeasureLabel();
	const pageSize = useTablePrefsStore((s) => s.pageSize);
	const setPageSize = useTablePrefsStore((s) => s.setPageSize);

	return (
		<RankingTable
			title="Топ Дистрибьюторы"
			nameHeader="Дистрибьютор"
			measureLabel={measureLabel}
			data={data}
			isStale={isStale}
			pageSize={pageSize}
			onPageSizeChange={setPageSize}
		/>
	);
}
