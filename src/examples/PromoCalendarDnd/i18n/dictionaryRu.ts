import { PromoCalendarTranslations } from "./dictionary";
import { ITranslations, makeDictionary } from "./makeDictionary";
import { TextFn, TextVars } from "./text";

const translationsRu: PromoCalendarTranslations = {
	calendar: {
		title: "Промо-календарь",
		loading: "Загрузка...",
		error: "Ошибка загрузки данных",
		group: "Группа"
	},
	panel: {
		year: "Год",
		months: "Месяцы",
		monthFrom: "С",
		monthTo: "По",
		grouping: "Группировка",
		sort: "Сортировка",
		search: "Поиск",
		searchPlaceholder: "Название промо",
		today: "Показать текущий день"
	},
	promo: {
		name: "Наименование:",
		duration: "Длительность:",
		brand: "Бренд:",
		channel: "Канал:",
		daysShort: "дн."
	}
} satisfies ITranslations;

/** Плоская карта точечный-ключ → значение. Стабильная модульная ссылка. */
const ru = makeDictionary(translationsRu);


/** Интерполяция шаблона: первый арг — строка-значение, не ключ. */
const textFromTemplate = (template: string, vars?: TextVars): string => {
    if (!vars) return template;
	return template.replace(/\{(\w+)\}/g, (_, k: string) => (k in vars ? String(vars[k]) : `{${k}}`));
}

export const textFromLocalDictionary: TextFn = (key, vars) => {
    return textFromTemplate(ru[key], vars);
}



    


