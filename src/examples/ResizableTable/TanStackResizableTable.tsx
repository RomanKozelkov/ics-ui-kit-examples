import { useMemo, useState } from "react";
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { cn } from "ics-ui-kit/lib/utils";
import { Button } from "ics-ui-kit/components/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "ics-ui-kit/components/table";
import { RotateCcw } from "lucide-react";
import { DashboardCard } from "../../shared/components/DashboardCard";
import { getColumnAutoFitWidth } from "./columnAutoFit";
import { ResizeHandle } from "./ResizeHandle";
import { DISTRIBUTOR_ROWS, type DistributorRow } from "./mockData";

const nf = new Intl.NumberFormat("ru-RU");
const DEFAULT_MIN_WIDTH = 60;
const DEFAULT_MAX_WIDTH = 500;

/**
 * Ресайз колонок реализован через встроенный column resizing @tanstack/react-table
 * (getResizeHandler / getSize) — драг-математика там та же, что в MDT-шном
 * ResizeSession.ts (clamp(minWidth, startWidth + dx)), но уже готовая и без завязки
 * на legacy Mithril ListCtrl/GlobalVarManager/settingsStore.
 * Autofit (getColumnAutoFitWidth) скопирован в ./columnAutoFit.ts с пометкой,
 * т.к. это чистый DOM-алгоритм без внешних зависимостей.
 *
 * Важно: таблице нужен table-layout: fixed, иначе браузер сам перераспределяет
 * ширины остальных колонок при ресайзе одной (в MDT это тоже включается явно).
 *
 * Для сравнения "чистой" реализации без TanStack — см. VanillaResizableTable.tsx.
 */
const columns: ColumnDef<DistributorRow>[] = [
	{ accessorKey: "distributor", header: "Дистрибьютор", size: 220, minSize: 120 },
	{ accessorKey: "region", header: "Регион", size: 160, minSize: 100 },
	{ accessorKey: "category", header: "Категория", size: 120, minSize: 90 },
	{ accessorKey: "manager", header: "Менеджер", size: 160, minSize: 100 },
	{
		accessorKey: "units",
		header: "Юниты",
		size: 110,
		minSize: 80,
		cell: (ctx) => <span className="tabular-nums">{nf.format(ctx.getValue<number>())}</span>
	},
	{
		accessorKey: "revenue",
		header: "Выручка, ₽",
		size: 140,
		minSize: 100,
		cell: (ctx) => <span className="tabular-nums">{nf.format(ctx.getValue<number>())}</span>
	},
	{
		accessorKey: "growth",
		header: "YoY%",
		size: 90,
		minSize: 70,
		cell: (ctx) => {
			const value = ctx.getValue<number>();
			return (
				<span className={cn("tabular-nums", value >= 0 ? "text-status-success-fg" : "text-status-error-fg")}>
					{value >= 0 ? "+" : ""}
					{value.toFixed(1)}%
				</span>
			);
		}
	}
];

export function TanStackResizableTable() {
	const data = useMemo(() => DISTRIBUTOR_ROWS, []);
	const [columnSizing, setColumnSizing] = useState({});

	const table = useReactTable({
		data,
		columns,
		columnResizeMode: "onChange",
		state: { columnSizing },
		onColumnSizingChange: setColumnSizing,
		getCoreRowModel: getCoreRowModel()
	});

	return (
		<DashboardCard
			title="Дистрибьюторы — @tanstack/react-table"
			subtitle="Ресайз и автофит (двойной клик) на встроенном column resizing TanStack Table."
			actions={
				<Button variant="outline" size="sm" startIcon={RotateCcw} onClick={() => setColumnSizing({})}>
					Сбросить ширины
				</Button>
			}
		>
			<Table style={{ width: table.getTotalSize(), tableLayout: "fixed" }}>
				<TableHeader>
					<TableRow>
						{table.getFlatHeaders().map((header) => (
							<TableHead
								key={header.id}
								className="relative select-none overflow-hidden text-ellipsis whitespace-nowrap"
								style={{ width: header.getSize() }}
							>
								{flexRender(header.column.columnDef.header, header.getContext())}
								<ResizeHandle
									onMouseDown={header.getResizeHandler()}
									onTouchStart={header.getResizeHandler()}
									active={header.column.getIsResizing()}
									onDoubleClick={(event) => {
										const th = (event.currentTarget as HTMLElement).closest("th");
										if (!th) return;
										const width = getColumnAutoFitWidth(th, {
											minWidth: header.column.columnDef.minSize ?? DEFAULT_MIN_WIDTH,
											maxWidth: header.column.columnDef.maxSize ?? DEFAULT_MAX_WIDTH
										});
										if (width != null) {
											setColumnSizing((prev) => ({ ...prev, [header.column.id]: width }));
										}
									}}
								/>
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows.map((row) => (
						<TableRow key={row.id}>
							{row.getVisibleCells().map((cell) => (
								<TableCell
									key={cell.id}
									className="overflow-hidden text-ellipsis whitespace-nowrap"
									style={{ width: cell.column.getSize() }}
								>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</DashboardCard>
	);
}
