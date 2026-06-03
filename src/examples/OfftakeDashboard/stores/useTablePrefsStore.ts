import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TablePrefsState = {
	pageSize: number;
};

export type TablePrefsActions = {
	setPageSize: (pageSize: number) => void;
	reset: () => void;
};

const DEFAULTS: TablePrefsState = {
	pageSize: 10
};

export const useTablePrefsStore = create<TablePrefsState & TablePrefsActions>()(
	persist(
		(set) => ({
			...DEFAULTS,
			setPageSize: (pageSize) => set({ pageSize }),
			reset: () => set(DEFAULTS)
		}),
		{ name: "offtakeDashboard:tablePrefs" }
	)
);
