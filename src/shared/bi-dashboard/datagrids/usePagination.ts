import { useState } from "react";

type PaginationPrefs = {
	pageSize: number;
	onPageSizeChange: (size: number) => void;
};

/**
 * Клиентская пагинация для массива строк. Размер страницы живёт снаружи
 * (в сторе настроек таблицы дашборда) и приходит через `prefs` — хук его не знает.
 */
export function usePagination<T>(rows: T[], prefs: PaginationPrefs) {
	const [page, setPage] = useState(1);
	const { pageSize, onPageSizeChange } = prefs;

	const start = (page - 1) * pageSize;
	const pageRows = rows.slice(start, start + pageSize);

	const handlePageSizeChange = (size: number) => {
		onPageSizeChange(size);
		setPage(1);
	};

	return {
		page,
		pageSize,
		pageRows,
		total: rows.length,
		setPage,
		setPageSize: handlePageSizeChange
	};
}
