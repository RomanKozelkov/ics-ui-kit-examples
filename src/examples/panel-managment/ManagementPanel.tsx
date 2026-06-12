import { YearSelect } from "./controls/YearSelect";
import { MonthRangeSelect } from "./controls/MonthRangeSelect";
import { GroupingSelect } from "./controls/GroupingSelect";
import { SortSelect } from "./controls/SortSelect";
import { FiltersButton } from "./controls/FiltersButton";
import { PromoSearch } from "./controls/PromoSearch";
import { TodayButton } from "./controls/TodayButton";
import type { ManagementPanelProps } from "./types";

/**
 * Панель управления промо-календарём.
 *
 * Владеет всем состоянием фильтрации/сортировки/группировки (zustand + persist),
 * сохраняет его в localStorage и восстанавливает при следующем открытии.
 * Сам календарь не рендерит — наружу отдаёт только callback `onShowToday`.
 */
export function ManagementPanel({ onShowToday, className }: ManagementPanelProps) {
	return (
		<div className={["flex flex-wrap items-end gap-3", className].filter(Boolean).join(" ")}>
			<YearSelect />
			<MonthRangeSelect />
			<GroupingSelect />
			<SortSelect />
			<FiltersButton />
			<PromoSearch />
			<TodayButton onShowToday={onShowToday} />
		</div>
	);
}
