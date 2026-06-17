import { createContext, useContext } from "react";
import { createStore, useStore } from "zustand";
import { persist } from "zustand/middleware";
import { DAY_WIDTH_DEFAULT, GROUPING_VALUES, clamp, clampDayWidth } from "../data/options";

// Поля группировки. Пустой массив = без группировки; порядок = вложенность уровней.
export type Grouping = "channel" | "client";

export type SortBy = "startDateAsc" | "nameAsc";

// Весь год: диапазон месяцев января–декабря. Общая «база» для init и goToToday.
const FULL_YEAR_MONTHS = { monthFrom: 0, monthTo: 11 } as const;

// Приводим произвольный persist к массиву валидных уровней без дублей (порядок сохраняем).
const sanitizeGrouping = (value: unknown): Grouping[] => {
	if (!Array.isArray(value)) return [];
	const seen = new Set<Grouping>();
	for (const v of value) {
		if (GROUPING_VALUES.includes(v as Grouping)) seen.add(v as Grouping);
	}
	return [...seen];
};

export type PanelStore = {
	/** Доступные годы (bootstrap из useYearsQuery, инжектятся при создании стора). Не персистятся. */
	years: number[];
	/** Выбранный год (01.01–31.12 этого года). */
	year: number;
	/** Начальный месяц диапазона, 0–11. */
	monthFrom: number;
	/** Конечный месяц диапазона, 0–11. */
	monthTo: number;
	/** Группировка строк: упорядоченные уровни вложенности. */
	grouping: Grouping[];
	/** Масштаб таймлайна: ширина одного дня в пикселях. */
	dayWidth: number;

	setYear: (year: number) => void;
	setMonthFrom: (monthFrom: number) => void;
	setMonthTo: (monthTo: number) => void;
	setGrouping: (grouping: Grouping[]) => void;
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
	const clampYear = (year: number) => clamp(year, yearMin, yearMax);

	return createStore<PanelStore>()(
		persist(
			(set) => ({
				years,
				year: clampYear(new Date().getFullYear()),
				...FULL_YEAR_MONTHS,
				grouping: [],
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
					set({
						year: clampYear(new Date().getFullYear()),
						...FULL_YEAR_MONTHS,
						showToday: true
					});
				},
				resetShowToday: () => set({ showToday: false })
			}),
			{
				name: "promoManagementPanel:settings",
				// years — bootstrap из query, не настройка: персистить нельзя (устареет список).
				partialize: ({ showToday, goToToday, resetShowToday, years, ...s }) => s,
				// Регидрация из localStorage: зажимаем год и месяцы, чтобы старый/невалидный
				// persist не «залипал» на значении, которого нет в Select.
				merge: (persisted, current) => {
					const merged = { ...current, ...(persisted as Partial<PanelStore>) };
					const monthFrom = clamp(merged.monthFrom, 0, 11);
					const monthTo = clamp(merged.monthTo, 0, 11);
					return {
						...merged,
						year: clampYear(merged.year),
						monthFrom,
						monthTo: Math.max(monthFrom, monthTo),
						// Масштаб из persist (в т.ч. непрерывный от Ctrl+колеса) → в границы [MIN,MAX].
						dayWidth: clampDayWidth(merged.dayWidth),
						// Старый persist мог хранить grouping строкой ("none"/...) — отбрасываем невалидное,
						// оставляем массив валидных уровней без дублей.
						grouping: sanitizeGrouping(merged.grouping)
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
