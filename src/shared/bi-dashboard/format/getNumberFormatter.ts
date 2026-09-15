const cache = new Map<string, Intl.NumberFormat>();

/**
 * Локаль чисел по умолчанию.
 *
 * Задана явно, а не взята из окружения: без неё формат зависел бы от настроек браузера, а при
 * SSR — от локали Node, и серверная разметка расходилась бы с клиентской.
 */
export const DEFAULT_LOCALE = "ru-RU";

/**
 * Возвращает закешированный `Intl.NumberFormat` для пары locale+options.
 */
export const getNumberFormatter = (
	locale: string = DEFAULT_LOCALE,
	options: Intl.NumberFormatOptions = {}
) => {
	const key = `${locale}|${JSON.stringify(options)}`;
	let formatter = cache.get(key);
	if (!formatter) {
		formatter = new Intl.NumberFormat(locale, options);
		cache.set(key, formatter);
	}
	return formatter;
};
