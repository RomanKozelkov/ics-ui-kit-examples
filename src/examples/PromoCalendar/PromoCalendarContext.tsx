import { createContext, useContext } from "react";
import type { PromoApi } from "./api/promo.api";
import type { TextFn } from "./i18n";

export type Locale = "ru" | "en";

export type PromoCalendarConfig = {
	years: number[];
	/** Источник данных. DI: подменяется для прод/тестов. */
	api: PromoApi;
	/** Функция перевода. DI: словарь / i18next / стаб. */
	text: TextFn;
};

export const PromoCalendarContext = createContext<PromoCalendarConfig | null>(null);

export function usePromoCalendarContext(): PromoCalendarConfig {
	const ctx = useContext(PromoCalendarContext);
	if (!ctx) throw new Error("usePromoCalendarContext must be used within PromoCalendarContext.Provider");
	return ctx;
}
