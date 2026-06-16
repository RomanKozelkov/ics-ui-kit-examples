import { createContext, useContext } from "react";
import { createStore, useStore } from "zustand";
import { persist } from "zustand/middleware";

export type Grouping = "none" | "channel" | "client" | "brand";

export type SortBy = "startDateAsc" | "nameAsc";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export type PanelStore = {
	/** Выбранный год (01.01–31.12 этого года). */
	year: number;
	/** Начальный месяц диапазона, 0–11. */
	monthFrom: number;
	/** Конечный месяц диапазона, 0–11. */
	monthTo: number;
	/** Группировка строк. */
	grouping: Grouping;

	setYear: (year: number) => void;
	setMonthFrom: (monthFrom: number) => void;
	setMonthTo: (monthTo: number) => void;
	setGrouping: (grouping: Grouping) => void;

	/** Триггер прокрутки к текущему дню. Сбрасывается потребителем через resetShowToday. */
	showToday: boolean;
	triggerShowToday: () => void;
	resetShowToday: () => void;
};

export const createPanelStore = ({ years }: { years: number[] }) => {
	const yearMin = years[0];
	const yearMax = years[years.length - 1];

	return createStore<PanelStore>()(
		persist(
			(set) => ({
				year: clamp(new Date().getFullYear(), yearMin, yearMax),
				monthFrom: 0,
				monthTo: 11,
				grouping: "none",
				setYear: (year) => set({ year }),
				// Инвариант: monthFrom <= monthTo. Подтягиваем границу при нарушении.
				setMonthFrom: (monthFrom) => set((s) => ({ monthFrom, monthTo: Math.max(monthFrom, s.monthTo) })),
				setMonthTo: (monthTo) => set((s) => ({ monthTo, monthFrom: Math.min(monthTo, s.monthFrom) })),
				setGrouping: (grouping) => set({ grouping }),
				showToday: false,
				triggerShowToday: () => set({ showToday: true }),
				resetShowToday: () => set({ showToday: false })
			}),
			{
				name: "promoManagementPanel:settings",
				partialize: ({ showToday, triggerShowToday, resetShowToday, ...s }) => s,
				// Регидрация из localStorage: зажимаем год и месяцы, чтобы старый/невалидный
				// persist не «залипал» на значении, которого нет в Select.
				merge: (persisted, current) => {
					const merged = { ...current, ...(persisted as Partial<PanelStore>) };
					const monthFrom = clamp(merged.monthFrom, 0, 11);
					const monthTo = clamp(merged.monthTo, 0, 11);
					return {
						...merged,
						year: clamp(merged.year, yearMin, yearMax),
						monthFrom,
						monthTo: Math.max(monthFrom, monthTo)
					};
				}
			}
		)
	);
};

export const PanelStoreContext = createContext<ReturnType<typeof createPanelStore> | null>(null);

export function usePanelStore<T>(selector: (state: PanelStore) => T): T {
	const store = useContext(PanelStoreContext);
	if (!store) throw new Error("usePanelStore must be used within ManagementPanel");
	return useStore(store, selector);
}
