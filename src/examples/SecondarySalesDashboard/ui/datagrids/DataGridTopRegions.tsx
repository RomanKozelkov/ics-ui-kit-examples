import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "ics-ui-kit/components/table";
import { DashboardCard } from "../../../../shared/components/DashboardCard";
import { StaleOverlay } from "../../../../shared/components/StaleOverlay";
import { RankCell, YoyCell } from "./TableCells";
import { TablePagination } from "./TablePagination";
import { usePagination } from "./usePagination";
import { useRegionsTableView } from "./useRegionsData";
import { useMeasureLabel } from "./useDistributorsData";
import { getNumberFormatter } from "../../utils/getNumberFormatter";

const nf = getNumberFormatter();

export function DataGridTopRegions() {
	const { data, isStale } = useRegionsTableView();
	const measureLabel = useMeasureLabel();
	const rows = data ?? [];

	const { page, pageSize, pageRows, total, setPage, setPageSize } = usePagination(rows);

	return (
		<DashboardCard title="Топ Регионы">
			<StaleOverlay isStale={isStale}>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[40px] text-right">№</TableHead>
							<TableHead>Регион</TableHead>
							<TableHead className="text-right">{measureLabel}</TableHead>
							<TableHead className="text-right">YOY%</TableHead>
							<TableHead className="text-right">Share</TableHead>
							<TableHead className="text-right">Rank</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{pageRows.map((row) => (
							<TableRow key={row.name}>
								<TableCell className="text-right text-secondary-fg">{row.sortOrder}</TableCell>
								<TableCell className="font-medium">{row.name}</TableCell>
								<TableCell className="text-right tabular-nums">{nf.format(row.sales)}</TableCell>
								<TableCell className="text-right tabular-nums">
									<YoyCell value={row.yoy} />
								</TableCell>
								<TableCell className="text-right tabular-nums">{row.share}%</TableCell>
								<TableCell className="text-right tabular-nums">
									<RankCell value={row.rank} />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				<TablePagination
					page={page}
					pageSize={pageSize}
					total={total}
					onPageChange={setPage}
					onPageSizeChange={setPageSize}
				/>
			</StaleOverlay>
		</DashboardCard>
	);
}
