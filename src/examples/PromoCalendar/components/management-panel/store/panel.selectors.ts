import { PanelStore } from "./panel.store";

const pad2 = (n: number) => String(n).padStart(2, "0");

export type DateRange = {
	dateBegin: string; // YYYY-MM-DD
	dateEnd: string; // YYYY-MM-DD
};

export function selectDateRange(state: PanelStore): DateRange {
	const { year, monthFrom, monthTo } = state;
	const lastDay = new Date(year, monthTo + 1, 0).getDate();
	return {
		dateBegin: `${year}-${pad2(monthFrom + 1)}-01`,
		dateEnd: `${year}-${pad2(monthTo + 1)}-${pad2(lastDay)}`
	};
}
