import { RankingTable } from "../../../../shared/bi-dashboard/datagrids/RankingTable";
import { useTablePrefsStore } from "../../stores/useTablePrefsStore";
import { useBrandsTableView } from "./useBrandsData";
import { useMeasureLabel } from "./useDistributorsData";

export function DataGridTopBrands() {
	const { data, isStale } = useBrandsTableView();
	const measureLabel = useMeasureLabel();
	const pageSize = useTablePrefsStore((s) => s.pageSize);
	const setPageSize = useTablePrefsStore((s) => s.setPageSize);

	return (
		<RankingTable
			title="Топ Бренды"
			nameHeader="Бренд"
			measureLabel={measureLabel}
			data={data}
			isStale={isStale}
			pageSize={pageSize}
			onPageSizeChange={setPageSize}
		/>
	);
}
