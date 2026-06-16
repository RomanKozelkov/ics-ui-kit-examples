/**
 * Тип: рекурсивно собирает точечные ключи из вложенного объекта переводов.
 * { calendar: { title } } → "calendar.title".
 *
 * Источник дерева переводов должен быть `type`, а не `interface`: интерфейсы
 * не получают неявную index signature и не присваиваются к `ITranslations`.
 */
export interface ITranslations {
	[key: string]: string | ITranslations;
}

export type Dictionary<T extends ITranslations, Prefix extends string = ""> = {
	[K in keyof T & string]: T[K] extends string
		? `${Prefix}${K}`
		: T[K] extends ITranslations
			? Dictionary<T[K], `${Prefix}${K}.`>
			: never;
}[keyof T & string];

/** Плоская карта точечный-ключ → значение. `Dictionary` даёт union ключей — оборачиваем в `Record`. */
export type FlatDictionary<T extends ITranslations, Prefix extends string = ""> = Record<Dictionary<T, Prefix>, string>;

/** Рантайм: расплющивает вложенный объект в плоскую карту точечный-ключ → значение. */
export const makeDictionary = <T extends ITranslations, Prefix extends string = "">(obj: T, prefix: Prefix = "" as Prefix): FlatDictionary<T, Prefix> => {
	const out = {} as FlatDictionary<T, Prefix>;
	for (const [k, v] of Object.entries(obj)) {
		const key = prefix ? `${prefix}.${k}` : k;
		if (typeof v === "string") out[key as keyof typeof out] = v as never;
		else Object.assign(out, makeDictionary(v as ITranslations, key));
	}
	return out;
};
