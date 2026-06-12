import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "ics-ui-kit/components/select";
import { FilterField } from "../../../shared/bi-dashboard/ui/FilterField";
import { usePanelStore } from "../store/usePanelStore";
import { SORT_OPTIONS, isSortBy } from "../data/options";

export function SortSelect() {
	const sort = usePanelStore((s) => s.sort);
	const setSort = usePanelStore((s) => s.setSort);

	return (
		<FilterField label="Сортировка">
			<Select value={sort} onValueChange={(v) => isSortBy(v) && setSort(v)}>
				<SelectTrigger className="w-60">
					<SelectValue placeholder="Сортировка" />
				</SelectTrigger>
				<SelectContent>
					{SORT_OPTIONS.map((o) => (
						<SelectItem key={o.value} value={o.value}>
							{o.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</FilterField>
	);
}
