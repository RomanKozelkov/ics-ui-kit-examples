// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "ics-ui-kit/components/select";
// import { FilterField } from "../../../../../shared/bi-dashboard/ui/FilterField";
// import { usePanelStore } from "../store/usePanelStore";
// import { SORT_OPTIONS, isSortBy } from "../data/options";
// import { useText } from "../../../i18n";

// export function SortSelect() {
// 	const sort = usePanelStore((s) => s.sort);
// 	const setSort = usePanelStore((s) => s.setSort);
// 	const text = useText();

// 	return (
// 		<FilterField label={text("panel.sort")}>
// 			<Select value={sort} onValueChange={(v) => isSortBy(v) && setSort(v)}>
// 				<SelectTrigger className="w-60">
// 					<SelectValue placeholder={text("panel.sort")} />
// 				</SelectTrigger>
// 				<SelectContent>
// 					{SORT_OPTIONS.map((o) => (
// 						<SelectItem key={o.value} value={o.value}>
// 							{o.label}
// 						</SelectItem>
// 					))}
// 				</SelectContent>
// 			</Select>
// 		</FilterField>
// 	);
// }
