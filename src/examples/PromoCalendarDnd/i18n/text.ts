import { type TextKey } from "./dictionary";
export type TextVars = Record<string, string | number>;

/**
 * Ключ типизирован: только из словаря.
 */
export type TextFn = (key: TextKey, vars?: TextVars) => string;
