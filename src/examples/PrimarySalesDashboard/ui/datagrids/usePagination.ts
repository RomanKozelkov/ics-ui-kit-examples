import { useState } from "react";

export function usePagination<T>(rows: T[], initialPageSize = 10) {
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(initialPageSize);

	const start = (page - 1) * pageSize;
	const pageRows = rows.slice(start, start + pageSize);

	const handlePageSizeChange = (size: number) => {
		setPageSize(size);
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
