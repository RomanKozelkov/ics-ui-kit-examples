import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SearchSelectOption } from "ics-ui-kit/components/search-select";
import type { Grouping, PanelState, SortBy } from "../types";
import { YEARS } from "../data/options";

type PanelActions = {
	setYear: (year: number) => void;
	setMonthFrom: (monthFrom: number) => void;
	setMonthTo: (monthTo: number) => void;
	setGrouping: (grouping: Grouping) => void;
	setSort: (sort: SortBy) => void;
	setChannels: (channels: SearchSelectOption[]) => void;
	setClients: (clients: SearchSelectOption[]) => void;
	setBrands: (brands: SearchSelectOption[]) => void;
	setSearch: (search: string) => void;
	/** Сбрасывает только фильтры (канал/клиент/бренд), на которые завязан Counter. */
	resetFilters: () => void;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

// YEARS — непрерывный диапазон, поэтому зажатие в [первый, последний] всегда даёт валидный год.
const YEAR_MIN = YEARS[0];
const YEAR_MAX = YEARS[YEARS.length - 1];

const DEFAULTS: PanelState = {
	year: clamp(new Date().getFullYear(), YEAR_MIN, YEAR_MAX),
	monthFrom: 0,
	monthTo: 11,
	grouping: "none",
	sort: "startDateAsc",
	channels: [],
	clients: [],
	brands: [],
	search: ""
};

export const usePanelStore = create<PanelState & PanelActions>()(
	persist(
		(set) => ({
			...DEFAULTS,
			setYear: (year) => set({ year }),
			// Инвариант: monthFrom <= monthTo. Подтягиваем границу при нарушении.
			setMonthFrom: (monthFrom) => set((s) => ({ monthFrom, monthTo: Math.max(monthFrom, s.monthTo) })),
			setMonthTo: (monthTo) => set((s) => ({ monthTo, monthFrom: Math.min(monthTo, s.monthFrom) })),
			setGrouping: (grouping) => set({ grouping }),
			setSort: (sort) => set({ sort }),
			setChannels: (channels) => set({ channels }),
			setClients: (clients) => set({ clients }),
			setBrands: (brands) => set({ brands }),
			setSearch: (search) => set({ search }),
			resetFilters: () => set({ channels: [], clients: [], brands: [] })
		}),
		{
			name: "promoManagementPanel:settings",
			// Регидрация из localStorage: зажимаем год и месяцы, чтобы старый/невалидный
			// persist не «залипал» на значении, которого нет в Select.
			merge: (persisted, current) => {
				const merged = { ...current, ...(persisted as Partial<PanelState>) };
				const monthFrom = clamp(merged.monthFrom, 0, 11);
				const monthTo = clamp(merged.monthTo, 0, 11);
				return {
					...merged,
					year: clamp(merged.year, YEAR_MIN, YEAR_MAX),
					monthFrom,
					monthTo: Math.max(monthFrom, monthTo)
				};
			}
		}
	)
);
