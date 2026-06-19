import { YearSelect } from "./controls/YearSelect";
import { MonthRangeSelect } from "./controls/MonthRangeSelect";
import { GroupingSelect } from "./controls/GroupingSelect";
import { ZoomSelect } from "./controls/ZoomSelect";
// import { PromoSearch } from "./controls/PromoSearch";
import { TodayButton } from "./controls/TodayButton";
import { AddPromoButton } from "./controls/AddPromoButton";

export function ManagementPanel() {
	return (
		<div className={"flex flex-wrap items-end gap-3"}>
			<AddPromoButton />
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
