import { createContext, useContext } from "react";
import { createStore, useStore } from "zustand";
import { persist } from "zustand/middleware";
import { DAY_WIDTH_DEFAULT, clampDayWidth } from "../data/options";

export type Grouping = "none" | "channel" | "client";

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
	/** Масштаб таймлайна: ширина одного дня в пикселях. */
	dayWidth: number;

	setYear: (year: number) => void;
	setMonthFrom: (monthFrom: number) => void;
	setMonthTo: (monthTo: number) => void;
	setGrouping: (grouping: Grouping) => void;
	setDayWidth: (dayWidth: number) => void;

	/** Триггер прокрутки к текущему дню. Сбрасывается потребителем через resetShowToday. */
	showToday: boolean;
	/** Переключить период на реальный сегодня (год + весь диапазон месяцев) и прокрутить к нему. */
	goToToday: () => void;
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
				dayWidth: DAY_WIDTH_DEFAULT,
				setYear: (year) => set({ year }),
				// Инвариант: monthFrom <= monthTo. Подтягиваем границу при нарушении.
				setMonthFrom: (monthFrom) => set((s) => ({ monthFrom, monthTo: Math.max(monthFrom, s.monthTo) })),
				setMonthTo: (monthTo) => set((s) => ({ monthTo, monthFrom: Math.min(monthTo, s.monthFrom) })),
				setGrouping: (grouping) => set({ grouping }),
				setDayWidth: (dayWidth) => set({ dayWidth }),
				showToday: false,
				// Сегодня — реальная дата: переключаем год/месяцы на текущие (год зажат в доступный
				// диапазон), затем поднимаем флаг прокрутки. Месяцы раскрываем на весь год.
				goToToday: () => {
					const now = new Date();
					set({
						year: clamp(now.getFullYear(), yearMin, yearMax),
						monthFrom: 0,
						monthTo: 11,
						showToday: true
					});
				},
				resetShowToday: () => set({ showToday: false })
			}),
			{
				name: "promoManagementPanel:settings",
				partialize: ({ showToday, goToToday, resetShowToday, ...s }) => s,
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
						monthTo: Math.max(monthFrom, monthTo),
						// Масштаб из persist (в т.ч. непрерывный от Ctrl+колеса) → в границы [MIN,MAX].
						dayWidth: clampDayWidth(merged.dayWidth)
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
