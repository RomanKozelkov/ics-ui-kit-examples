/**
 * Портировано из MDT (adapted, not imported directly):
 * ui/_core/scripts/views/list/features/columnResize/ColumnAutoFit.ts
 *
 * Меряет "естественную" ширину контента колонки — клонирует заголовок и видимые
 * ячейки тела в скрытую sandbox-таблицу с table-layout:auto/width:max-content
 * и берёт итоговую ширину. В оригинале MDT дополнительно копировал className
 * ближайшего `.grid-outer` контейнера — здесь это не нужно, т.к. cloneCell уже
 * переносит вычисленные (computed) шрифтовые стили на клон.
 */
export interface ColumnAutoFitOptions {
	minWidth: number;
	maxWidth: number;
}

export function getColumnAutoFitWidth(header: HTMLTableCellElement, options: ColumnAutoFitOptions): number | undefined {
	const table = header.closest("table");
	if (!table || header.cellIndex < 0) return;

	const columnIndex = getLogicalColumnIndex(header);
	const cells = [header, ...getVisibleCells(table, columnIndex)];

	const sandbox = document.createElement("div");
	sandbox.setAttribute("aria-hidden", "true");
	sandbox.style.position = "absolute";
	sandbox.style.left = "-10000px";
	sandbox.style.top = "0";
	sandbox.style.visibility = "hidden";
	sandbox.style.width = "max-content";

	const measuredTable = table.cloneNode(false) as HTMLTableElement;
	measuredTable.removeAttribute("style");
	measuredTable.style.width = "max-content";
	measuredTable.style.maxWidth = "none";
	measuredTable.style.tableLayout = "auto";

	const thead = measuredTable.createTHead();
	thead.insertRow().appendChild(cloneCell(cells[0]));
	const tbody = measuredTable.createTBody();
	cells.slice(1).forEach((cell) => tbody.insertRow().appendChild(cloneCell(cell)));
	sandbox.appendChild(measuredTable);
	document.body.appendChild(sandbox);

	const width = Math.ceil(measuredTable.getBoundingClientRect().width);
	document.body.removeChild(sandbox);
	return Math.max(options.minWidth, Math.min(options.maxWidth, width));
}

function getVisibleCells(table: HTMLTableElement, columnIndex: number) {
	const cells: HTMLTableCellElement[] = [];
	Array.from(table.tBodies).forEach((tbody) => {
		Array.from(tbody.rows).forEach((row) => {
			const cell = getCellAtColumn(row, columnIndex);
			if (cell && cell.getClientRects().length) cells.push(cell);
		});
	});
	return cells;
}

function getLogicalColumnIndex(cell: HTMLTableCellElement) {
	let index = 0;
	let previous = cell.previousElementSibling as HTMLTableCellElement | null;
	while (previous) {
		index += previous.colSpan || 1;
		previous = previous.previousElementSibling as HTMLTableCellElement | null;
	}
	return index;
}

function getCellAtColumn(row: HTMLTableRowElement, columnIndex: number) {
	let currentIndex = 0;
	for (const cell of Array.from(row.cells)) {
		const colSpan = cell.colSpan || 1;
		if (columnIndex >= currentIndex && columnIndex < currentIndex + colSpan) return colSpan === 1 ? cell : undefined;
		currentIndex += colSpan;
	}
}

function cloneCell(cell: HTMLTableCellElement) {
	const clone = cell.cloneNode(true) as HTMLTableCellElement;
	const styles = getComputedStyle(cell);
	["font", "letter-spacing", "word-spacing", "text-transform", "white-space", "word-break", "overflow-wrap", "hyphens"].forEach(
		(property) => clone.style.setProperty(property, styles.getPropertyValue(property))
	);
	clone.style.width = "auto";
	clone.style.minWidth = "0";
	clone.style.maxWidth = "none";
	return clone;
}
