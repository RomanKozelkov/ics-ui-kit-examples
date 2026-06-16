import { createContext, useContext, type ReactNode } from "react";
import { type TextFn } from "./text";
import { textFromLocalDictionary } from "./dictionaryRu";

/**
 * Отдельный контекст под перевод (не мешаем в PromoCalendarContext),
 * чтобы потребители text не ререндерились при смене конфига/api.
 * value = сама функция: ссылка стабильна, пока стабильна text.
 */
const TextContext = createContext<TextFn>(textFromLocalDictionary);

export function TextProvider({ text = textFromLocalDictionary, children }: { text?: TextFn; children: ReactNode }) {
	return <TextContext.Provider value={text}>{children}</TextContext.Provider>;
}

export function useText(): TextFn {
	return useContext(TextContext);
}
