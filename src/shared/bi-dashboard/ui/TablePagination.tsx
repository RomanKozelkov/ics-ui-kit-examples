import { Button } from "ics-ui-kit/components/button";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "ics-ui-kit/components/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface TablePaginationProps {
	page: number;
	pageSize: number;
	total: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: number) => void;
	pageSizeOptions?: number[];
}

const DEFAULT_OPTIONS = [5, 10, 20, 50];

export function TablePagination({
	page,
	pageSize,
	total,
	onPageChange,
	onPageSizeChange,
	pageSizeOptions = DEFAULT_OPTIONS
}: TablePaginationProps) {
	const totalPages = Math.max(1, Math.ceil(total / pageSize));
	const safePage = Math.min(page, totalPages);
	const from = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
	const to = Math.min(safePage * pageSize, total);

	return (
		<div className="mt-3 flex items-center justify-between gap-3 text-sm text-secondary-fg">
			<div className="flex items-center gap-2">
				<span>Rows per page</span>
				<Select value={String(pageSize)} onValueChange={(v) => onPageSizeChange(Number(v))}>
					<SelectTrigger className="h-8 w-[72px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							{pageSizeOptions.map((opt) => (
								<SelectItem key={opt} value={String(opt)}>
									{opt}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
			<div className="flex items-center gap-3">
				<span className="tabular-nums">
					{from}-{to} of {total}
				</span>
				<div className="flex items-center gap-1">
					<Button
						variant="outline"
						size="sm"
						startIcon={ChevronLeft}
						disabled={safePage <= 1}
						onClick={() => onPageChange(safePage - 1)}
					>
						Previous
					</Button>
					<Button
						variant="outline"
						size="sm"
						endIcon={ChevronRight}
						disabled={safePage >= totalPages}
						onClick={() => onPageChange(safePage + 1)}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
}
