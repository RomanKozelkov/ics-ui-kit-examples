import { createContext, useContext } from "react";
import type { PromoApi } from "./api/promo.api";
import type { TextFn, Locale } from "./i18n";

/** @deprecated Тип переехал в i18n; ре-экспорт для обратной совместимости. */
export type { Locale };

export type PromoCalendarConfig = {
	/** Источник данных. DI: подменяется для прод/тестов. */
	api: PromoApi;
	/** Функция перевода. DI: словарь / i18next / стаб. */
	text: TextFn;
	/** Локаль для сортировок/Intl. DI вместе с text. */
	locale: Locale;
};

export const PromoCalendarContext = createContext<PromoCalendarConfig | null>(null);

export function usePromoCalendarContext(): PromoCalendarConfig {
	const ctx = useContext(PromoCalendarContext);
	if (!ctx) throw new Error("usePromoCalendarContext must be used within PromoCalendarContext.Provider");
	return ctx;
}
