import { type TextKey } from "./dictionary";
export type TextVars = Record<string, string | number>;

/** BCP-47 тег локали. Совпадает со строкой для Intl/localeCompare. */
export type Locale = "ru" | "en";

/**
 * Ключ типизирован: только из словаря.
 */
export type TextFn = (key: TextKey, vars?: TextVars) => string;

/** Заглушка для неподдерживаемых локалей: возвращает сам ключ. */
export const textFromKey: TextFn = (key) => key;
