import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "ics-ui-kit/components/table";
import { DashboardCard } from "../../components/DashboardCard";
import { StaleOverlay } from "../../components/StaleOverlay";
import { RankCell, YoyCell } from "../ui/TableCells";
import { TablePagination } from "../ui/TablePagination";
import { getNumberFormatter } from "../format";
import type { RankingRow } from "../ranking/aggregateRanking";
import { usePagination } from "./usePagination";

const nf = getNumberFormatter();

type RankingTableProps = {
	/** Заголовок карточки, напр. `"Топ Бренды"`. */
	title: string;
	/** Подпись колонки сущности, напр. `"Бренд"` / `"Клиент"` / `"Регион"`. */
	nameHeader: string;
	/** Подпись колонки значения (метрика), напр. `"Продажи, ₽"`. */
	measureLabel: string;
	data: RankingRow[] | undefined;
	isStale: boolean;
	/** Размер страницы из настроек таблицы дашборда + сеттер. */
	pageSize: number;
	onPageSizeChange: (size: number) => void;
};

/**
 * Презентационная таблица рейтинга (топ брендов/клиентов/регионов): № / сущность /
 * значение / YoY% / доля / изменение ранга, с клиентской пагинацией.
 * Данные приходят пропсами — запросы/стор живут в обёртке дашборда.
 */
export function RankingTable({
	title,
	nameHeader,
	measureLabel,
	data,
	isStale,
	pageSize,
	onPageSizeChange
}: RankingTableProps) {
	const rows = data ?? [];
	const { page, pageRows, total, setPage, setPageSize } = usePagination(rows, { pageSize, onPageSizeChange });

	return (
		<DashboardCard title={title}>
			<StaleOverlay isStale={isStale}>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[40px] text-right">№</TableHead>
							<TableHead>{nameHeader}</TableHead>
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
