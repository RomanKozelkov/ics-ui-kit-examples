import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Metric = "RUB" | "USD" | "Units";
// FY — полный год, YTD — с начала года, QTD — с начала квартала, MTD — с начала месяца
export type Period = "FY" | "YTD" | "QTD" | "MTD";
export type SourceType = "MDLP" | "Sales";
export type BindType = "History";

export type Option = { value: string; label: string };

export type FiltersState = {
	year: number;
	period: Period;
	metric: Metric;
	sourceType: SourceType;
	bindType: BindType;
	counterparties: Option[];
	contracts: Option[];
	salesChannels: Option[];
	brands: Option[];
};

export type FiltersActions = {
	setYear: (year: number) => void;
	setPeriod: (period: Period) => void;
	setMetric: (metric: Metric) => void;
	setSourceType: (sourceType: SourceType) => void;
	setBindType: (bindType: BindType) => void;
	setCounterparties: (counterparties: Option[]) => void;
	setContracts: (contracts: Option[]) => void;
	setSalesChannels: (salesChannels: Option[]) => void;
	setBrands: (brands: Option[]) => void;
	reset: () => void;
};

const DEFAULTS: FiltersState = {
	year: 2025,
	period: "FY",
	metric: "Units",
	sourceType: "MDLP",
	bindType: "History",
	counterparties: [],
	contracts: [],
	salesChannels: [],
	brands: []
};

export const useFiltersStore = create<FiltersState & FiltersActions>()(
	persist(
		(set) => ({
			...DEFAULTS,
			setYear: (year) => set({ year, period: "FY" }),
			setPeriod: (period) => set({ period }),
			setMetric: (metric) => set({ metric }),
			setSourceType: (sourceType) => set({ sourceType }),
			setBindType: (bindType) => set({ bindType }),
			setCounterparties: (counterparties) => set({ counterparties }),
			setContracts: (contracts) => set({ contracts }),
			setSalesChannels: (salesChannels) => set({ salesChannels }),
			setBrands: (brands) => set({ brands }),
			reset: () => set(DEFAULTS)
		}),
		{ name: "offtakeDashboard:filters" }
	)
);
