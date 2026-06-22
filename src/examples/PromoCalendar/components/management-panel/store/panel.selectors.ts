import { PanelStore } from "./panel.store";

export type DateRange = {
	dateBegin: string; // YYYY-MM-DD
	dateEnd: string; // YYYY-MM-DD
};

export function selectDateRange(state: PanelStore): DateRange {
	const { year } = state;

	return {
		dateBegin: `${year}-01-01`,
		dateEnd: `${year}-12-31`
	};
}
