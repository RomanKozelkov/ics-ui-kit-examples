import { useState } from "react";
import { useTablePrefsStore } from "../../stores/useTablePrefsStore";

export function usePagination<T>(rows: T[]) {
	const [page, setPage] = useState(1);
	const pageSize = useTablePrefsStore((s) => s.pageSize);
	const setStorePageSize = useTablePrefsStore((s) => s.setPageSize);

	const start = (page - 1) * pageSize;
	const pageRows = rows.slice(start, start + pageSize);

	const handlePageSizeChange = (size: number) => {
		setStorePageSize(size);
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
