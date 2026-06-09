/** Опции фильтра, нормализуемые в стабильный ключ кэша. */
type Option = { value: string };

/**
 * Стабильный список значений опций для ключа react-query: порядок выбора не должен
 * влиять на ключ, поэтому значения сортируются.
 */
export const sortIds = (opts: readonly Option[]): string[] => opts.map((o) => o.value).sort();
