import { YearSelect } from "./controls/YearSelect";
import { GroupingSelect } from "./controls/GroupingSelect";
import { ZoomSelect } from "./controls/ZoomSelect";
// import { PromoSearch } from "./controls/PromoSearch";
import { TodayButton } from "./controls/TodayButton";
import { AddPromoButton } from "./controls/AddPromoButton";
import { Divider } from "ics-ui-kit/components/divider";

export function ManagementPanel() {
	return (
		<div className={"flex flex-wrap items-end gap-3"}>
			<AddPromoButton />
			<Divider orientation="vertical" className="h-8" />
			<YearSelect />
			<GroupingSelect />
			<div className="ml-auto flex items-center gap-2">
				<ZoomSelect />
				{/* <SortSelect /> */}
				{/* <PromoSearch /> */}
				<TodayButton />
			</div>
		</div>
	);
}
