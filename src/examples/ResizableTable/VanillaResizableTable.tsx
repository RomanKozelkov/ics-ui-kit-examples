import type { ReactNode } from "react";
import { cn } from "ics-ui-kit/lib/utils";
import { Button } from "ics-ui-kit/components/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "ics-ui-kit/components/table";
import { RotateCcw } from "lucide-react";
import { DashboardCard } from "../../shared/components/DashboardCard";
import { ResizeHandle } from "./ResizeHandle";
import { type ResizableColumn, useColumnResize } from "./useColumnResize";
import { DISTRIBUTOR_ROWS, type DistributorRow } from "./mockData";

const nf = new Intl.NumberFormat("ru-RU");

type ColumnConfig = ResizableColumn<keyof DistributorRow> & {
	header: string;
	render: (row: DistributorRow) => ReactNode;
};

const COLUMNS: ColumnConfig[] = [
	{ key: "distributor", header: "Дистрибьютор", defaultWidth: 220, minWidth: 120, render: (r) => r.distributor },
	{ key: "region", header: "Регион", defaultWidth: 160, minWidth: 100, render: (r) => r.region },
	{ key: "category", header: "Категория", defaultWidth: 120, minWidth: 90, render: (r) => r.category },
	{ key: "manager", header: "Менеджер", defaultWidth: 160, minWidth: 100, render: (r) => r.manager },
	{
		key: "units",
		header: "Юниты",
		defaultWidth: 110,
		minWidth: 80,
		render: (r) => <span className="tabular-nums">{nf.format(r.units)}</span>
	},
	{
		key: "revenue",
		header: "Выручка, ₽",
		defaultWidth: 140,
		minWidth: 100,
		render: (r) => <span className="tabular-nums">{nf.format(r.revenue)}</span>
	},
	{
		key: "growth",
		header: "YoY%",
		defaultWidth: 90,
		minWidth: 70,
		render: (r) => (
			<span className={cn("tabular-nums", r.growth >= 0 ? "text-status-success-fg" : "text-status-error-fg")}>
				{r.growth >= 0 ? "+" : ""}
				{r.growth.toFixed(1)}%
			</span>
		)
	}
];

export function VanillaResizableTable() {
	const { tableRef, widths, totalWidth, getHeaderRef, getResizeHandleProps, reset } = useColumnResize(COLUMNS);

	return (
		<DashboardCard
			title="Дистрибьюторы — без библиотек"
			subtitle="Ресайз вручную (mousedown/mousemove/mouseup, прямая мутация DOM во время драга) — логика как в MDT ListColumnResizer. Двойной клик — автофит."
			actions={
				<Button variant="outline" size="sm" startIcon={RotateCcw} onClick={reset}>
					Сбросить ширины
				</Button>
			}
		>
			<Table ref={tableRef} style={{ width: totalWidth, tableLayout: "fixed" }}>
				<TableHeader>
					<TableRow>
						{COLUMNS.map((col) => (
							<TableHead
								key={col.key}
								ref={getHeaderRef(col.key)}
								className="relative select-none overflow-hidden text-ellipsis whitespace-nowrap"
								style={{ width: widths[col.key] ?? col.defaultWidth }}
							>
								{col.header}
								<ResizeHandle {...getResizeHandleProps(col.key)} />
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{DISTRIBUTOR_ROWS.map((row) => (
						<TableRow key={row.id}>
							{COLUMNS.map((col) => (
								<TableCell key={col.key} className="overflow-hidden text-ellipsis whitespace-nowrap">
									{col.render(row)}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</DashboardCard>
	);
}
