import { TanStackResizableTable } from "./TanStackResizableTable";
import { VanillaResizableTable } from "./VanillaResizableTable";

/**
 * Два варианта ресайза колонок на одних и тех же моках — для сравнения:
 *  - TanStackResizableTable.tsx — на встроенном column resizing @tanstack/react-table.
 *  - VanillaResizableTable.tsx — без table-библиотек, ресайз портирован по логике
 *    из MDT (ListColumnResizer.ts/ResizeSession.ts), см. комментарии в файле.
 * Автофит (двойной клик) в обоих случаях использует общий ./columnAutoFit.ts,
 * тоже портированный из MDT.
 */
export function ResizableTable() {
	return (
		<div className="flex flex-col gap-6 p-6">
			<TanStackResizableTable />
			<VanillaResizableTable />
		</div>
	);
}
