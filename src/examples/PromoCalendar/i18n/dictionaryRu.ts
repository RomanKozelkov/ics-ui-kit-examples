import { PromoCalendarTranslations } from "./dictionary";
import { ITranslations, makeDictionary } from "./makeDictionary";
import { TextFn, TextVars } from "./text";

const translationsRu: PromoCalendarTranslations = {
	calendar: {
		title: "Промо-календарь",
		loading: "Загрузка...",
		error: "Ошибка загрузки данных",
		retry: "Повторить",
		group: "Группа",
		allPromos: "Все промо",
		scrollToNearestLeft: "К ближайшему промо слева",
		scrollToNearestRight: "К ближайшему промо справа"
	},
	groupField: {
		channel: "Канал",
		client: "Клиент",
		brand: "Бренд"
	},
	panel: {
		year: "Год",
		months: "Месяцы",
		grouping: "Группировка",
		sort: "Сортировка",
		search: "Поиск",
		searchPlaceholder: "Название промо",
		today: "Сегодня",
		zoom: "Масштаб",
		zoomIn: "Увеличить масштаб",
		zoomOut: "Уменьшить масштаб",
		add: "Добавить"
	},
	editor: {
		createTitle: "Новое промо",
		editTitle: "Редактирование промо",
		save: "Сохранить",
		cancel: "Отмена",
		delete: "Удалить",
		titleLabel: "Наименование",
		channelLabel: "Канал",
		clientLabel: "Клиент",
		dateBeginLabel: "Дата начала",
		dateEndLabel: "Дата окончания"
	},
	promo: {
		name: "Наименование:",
		period: "Период:",
		brand: "Бренд:",
		channel: "Канал:",
		daysShort: "дн."
	}
};

/** Плоская карта точечный-ключ → значение. Стабильная модульная ссылка. */
const ru = makeDictionary(translationsRu);

/** Интерполяция шаблона: первый арг — строка-значение, не ключ. */
const textFromTemplate = (template: string, vars?: TextVars): string => {
	if (!vars) return template;
	return template.replace(/\{(\w+)\}/g, (_, k: string) => (k in vars ? String(vars[k]) : `{${k}}`));
};

export const textFromLocalDictionary: TextFn = (key, vars) => {
	return textFromTemplate(ru[key], vars);
};
