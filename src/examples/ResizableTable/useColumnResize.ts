import { type MouseEvent as ReactMouseEvent, type RefObject, useMemo, useRef, useState } from "react";
import { getColumnAutoFitWidth } from "./columnAutoFit";
import { ColumnResizeSession } from "./columnResizeSession";

export interface ResizableColumn<K extends string = string> {
	key: K;
	defaultWidth: number;
	minWidth: number;
	maxWidth?: number;
}

export interface UseColumnResizeOptions {
	/** Глобальный минимум-подстраховка для драга (как MIN_COLUMN_WIDTH в MDT ListColumnResizer). */
	minWidth?: number;
	/** Дефолтный максимум для колонок без своего maxWidth (используется в драге и автофите). */
	maxWidth?: number;
}

export interface UseColumnResizeResult<K extends string> {
	tableRef: RefObject<HTMLTableElement | null>;
	widths: Record<K, number>;
	totalWidth: number;
	getHeaderRef: (key: K) => (el: HTMLTableCellElement | null) => void;
	getResizeHandleProps: (key: K) => {
		onMouseDown: (event: ReactMouseEvent) => void;
		onDoubleClick: (event: ReactMouseEvent) => void;
	};
	reset: () => void;
}

const DEFAULT_MIN_WIDTH = 60;
const DEFAULT_MAX_WIDTH = 500;

/**
 * Ресайз + автофит колонок для обычных HTML-таблиц (без table-библиотек).
 *
 * Во время mousemove ширина мутируется напрямую в DOM (th.style.width, table.style.width)
 * через рефы — без React state на каждый пиксель. На mouseup — один коммит в state.
 *
 * `columns` должен быть стабильной ссылкой (модульная константа или useMemo вызывающей
 * стороны) — из неё один раз считаются дефолтные ширины.
 */
export function useColumnResize<K extends string>(
	columns: ResizableColumn<K>[],
	options: UseColumnResizeOptions = {}
): UseColumnResizeResult<K> {
	const globalMinWidth = options.minWidth ?? DEFAULT_MIN_WIDTH;
	const globalMaxWidth = options.maxWidth ?? DEFAULT_MAX_WIDTH;

	const columnsByKey = useMemo(() => new Map(columns.map((c) => [c.key, c])), [columns]);
	const defaultWidths = useMemo(
		() => Object.fromEntries(columns.map((c) => [c.key, c.defaultWidth])) as Record<K, number>,
		[columns]
	);

	const [widths, setWidths] = useState<Record<K, number>>(defaultWidths);
	const theadRefs = useRef<Partial<Record<K, HTMLTableCellElement>>>({});
	const tableRef = useRef<HTMLTableElement>(null);
	const sessionRef = useRef<ColumnResizeSession | undefined>(undefined);
	if (!sessionRef.current) sessionRef.current = new ColumnResizeSession(globalMinWidth);

	const clampWidth = (key: K, width: number) => {
		const col = columnsByKey.get(key);
		const min = col?.minWidth ?? globalMinWidth;
		const max = col?.maxWidth ?? globalMaxWidth;
		return Math.min(max, Math.max(min, width));
	};

	const getHeaderRef = (key: K) => (el: HTMLTableCellElement | null) => {
		theadRefs.current[key] = el ?? undefined;
	};

	const startResize = (key: K) => (event: ReactMouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
		const th = theadRefs.current[key];
		const table = tableRef.current;
		if (!th || !table) return;

		const session = sessionRef.current!;
		const startWidth = th.getBoundingClientRect().width;
		const startTableWidth = table.getBoundingClientRect().width;
		session.start(key, startWidth, event.clientX);

		const handleMove = (e: MouseEvent) => {
			const rawWidth = session.getWidth(e.clientX);
			const columnKey = session.getColumnKey() as K | undefined;
			if (rawWidth == null || !columnKey) return;
			const width = clampWidth(columnKey, rawWidth);
			th.style.width = `${width}px`;
			table.style.width = `${startTableWidth + width - startWidth}px`;
		};

		const handleUp = (e: MouseEvent) => {
			const rawWidth = session.getWidth(e.clientX);
			const columnKey = session.getColumnKey() as K | undefined;
			session.end();
			document.removeEventListener("mousemove", handleMove);
			document.removeEventListener("mouseup", handleUp);
			if (rawWidth != null && columnKey) {
				const width = clampWidth(columnKey, rawWidth);
				setWidths((prev) => ({ ...prev, [columnKey]: width }));
			}
		};

		document.addEventListener("mousemove", handleMove);
		document.addEventListener("mouseup", handleUp);
	};

	const autoFit = (key: K) => () => {
		const th = theadRefs.current[key];
		if (!th) return;
		const col = columnsByKey.get(key);
		const width = getColumnAutoFitWidth(th, {
			minWidth: col?.minWidth ?? globalMinWidth,
			maxWidth: col?.maxWidth ?? globalMaxWidth
		});
		if (width != null) setWidths((prev) => ({ ...prev, [key]: width }));
	};

	const getResizeHandleProps = (key: K) => ({
		onMouseDown: startResize(key),
		onDoubleClick: autoFit(key)
	});

	const totalWidth = columns.reduce((sum, col) => sum + (widths[col.key] ?? col.defaultWidth), 0);

	const reset = () => setWidths(defaultWidths);

	return { tableRef, widths, totalWidth, getHeaderRef, getResizeHandleProps, reset };
}
