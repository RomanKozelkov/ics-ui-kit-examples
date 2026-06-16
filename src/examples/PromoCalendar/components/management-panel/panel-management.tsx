import { YearSelect } from "./controls/YearSelect";
import { MonthRangeSelect } from "./controls/MonthRangeSelect";
import { GroupingSelect } from "./controls/GroupingSelect";
import { ZoomSelect } from "./controls/ZoomSelect";
// import { PromoSearch } from "./controls/PromoSearch";
import { TodayButton } from "./controls/TodayButton";

/**
 * Панель управления промо-календарём — чистый потребитель.
 *
 * Состояние фильтрации/сортировки/группировки живёт в zustand-сторе,
 * который провайдится выше (PromoCalendarDnd), чтобы календарь тоже его видел.
 */
export function ManagementPanel() {
	return (
		<div className={"flex flex-wrap items-end gap-3"}>
			<YearSelect />
			<MonthRangeSelect />
			<GroupingSelect />
			<ZoomSelect />
			{/* <SortSelect /> */}
			{/* <PromoSearch /> */}
			<TodayButton />
		</div>
	);
}
