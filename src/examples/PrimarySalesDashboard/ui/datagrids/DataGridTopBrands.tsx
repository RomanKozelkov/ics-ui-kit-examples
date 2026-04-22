import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "ics-ui-kit/components/table";
import { RankCell, YoyCell } from "./TableCells";
import { useBrandsTableView } from "./useBrandsData";
import { useMeasureLabel } from "./useDistributorsData";

const nf = new Intl.NumberFormat("ru-RU");

export function DataGridTopBrands() {
	const { data, isLoading } = useBrandsTableView();
	const measureLabel = useMeasureLabel();
	const rows = data ?? [];

	return (
		<div className="rounded-xl border border-secondary-border bg-secondary-bg p-4 px-5">
			<div className="mb-3 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<h2 className="text-base font-medium text-primary-fg">Топ Бренды</h2>
				</div>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[40px]">№</TableHead>
						<TableHead>Бренд</TableHead>
						<TableHead className="text-right">{measureLabel}</TableHead>
						<TableHead className="text-right">YOY%</TableHead>
						<TableHead className="text-right">Share</TableHead>
						<TableHead className="text-right">Rank</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{isLoading && rows.length === 0 ? (
						<TableRow>
							<TableCell colSpan={6} className="text-center text-secondary-fg">
								Загрузка…
							</TableCell>
						</TableRow>
					) : (
						rows.map((row) => (
							<TableRow key={row.name}>
								<TableCell className="text-secondary-fg">{row.sortOrder}</TableCell>
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
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}
