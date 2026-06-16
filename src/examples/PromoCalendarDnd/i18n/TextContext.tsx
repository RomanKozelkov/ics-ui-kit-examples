import { createContext, useContext, type ReactNode } from "react";
import { dictionaryText, type TextFn } from "./text";

/**
 * Отдельный контекст под перевод (не мешаем в PromoCalendarContext),
 * чтобы потребители text не ререндерились при смене конфига/api.
 * value = сама функция: ссылка стабильна, пока стабильна text.
 */
const TextContext = createContext<TextFn>(dictionaryText);

export function TextProvider({ text = dictionaryText, children }: { text?: TextFn; children: ReactNode }) {
	return <TextContext.Provider value={text}>{children}</TextContext.Provider>;
}

/** DI-хук: достаёт функцию перевода. Дефолт — словарь, отдельный Provider не обязателен. */
export function useText(): TextFn {
	return useContext(TextContext);
}
