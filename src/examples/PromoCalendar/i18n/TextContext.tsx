import { createContext, useContext, useMemo, type ReactNode } from "react";
import { type Locale, type TextFn } from "./text";

type TextContextValue = {
	text: TextFn;
	locale: Locale;
};

/**
 * Отдельный контекст под i18n (не мешаем в PromoCalendarContext),
 * чтобы потребители text/locale не ререндерились при смене конфига/api.
 *
 * null + throw, как PromoCalendarContext/PanelStoreContext: провайдер оборачивает всё дерево,
 * поэтому вызов хука без него = баг, а не повод для тихого RU-фоллбэка.
 */
const TextContext = createContext<TextContextValue | null>(null);

export function TextProvider({ text, locale, children }: TextContextValue & { children: ReactNode }) {
	const value = useMemo<TextContextValue>(() => ({ text, locale }), [text, locale]);
	return <TextContext.Provider value={value}>{children}</TextContext.Provider>;
}

function useTextContext(): TextContextValue {
	const ctx = useContext(TextContext);
	if (!ctx) throw new Error("useText/useLocale must be used within TextProvider");
	return ctx;
}

export function useText(): TextFn {
	return useTextContext().text;
}

export function useLocale(): Locale {
	return useTextContext().locale;
}
