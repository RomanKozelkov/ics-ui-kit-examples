import type { PromoCalendarItem } from "../../api/promo.types";

/**
 * Справочники для формы промо. Дублируют значения из api/mock/mock.data, но живут в UI-слое
 * намеренно: модуль редактора должен оставаться самодостаточным при копировании компонента
 * в реальный проект (там список каналов/клиентов придёт из своего источника). Метки каналов
 * здесь, т.к. в i18n-словаре их нет (channelType — сырой код).
 */
export const CHANNEL_OPTIONS: { value: string; label: string; channelId: number }[] = [
	{ value: "retail", label: "Розница", channelId: 1 },
	{ value: "distrib", label: "Дистрибуция", channelId: 2 },
	{ value: "ecom", label: "E-com", channelId: 3 },
	{ value: "opt", label: "Опт", channelId: 4 },
	{ value: "horeca", label: "HoReCa", channelId: 5 }
];

export const CLIENT_OPTIONS: { companyName: string; companyId: number }[] = [
	{ companyName: "Магнит", companyId: 1 },
	{ companyName: "X5 Group", companyId: 2 },
	{ companyName: "Лента", companyId: 3 },
	{ companyName: "Ашан", companyId: 4 },
	{ companyName: "Перекрёсток", companyId: 5 },
	{ companyName: "Дикси", companyId: 6 },
	{ companyName: "Метро", companyId: 7 },
	{ companyName: "ВкусВилл", companyId: 8 }
];

const TITLES = [
	"Жёлтый ценник",
	"Скидка 20%",
	"Подарок за покупку",
	"−30% на вторую",
	"Спецвыкладка",
	"Сезон распродаж",
	"Летний кэшбэк",
	"Неделя свежести"
];

const MS_DAY = 86_400_000;
const MIN_DURATION_DAYS = 3;
const MAX_DURATION_DAYS = 30;

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const toIso = (ms: number): string => new Date(ms).toISOString().split("T")[0];

/**
 * Случайная заготовка нового промо. Даты лежат внутри `year`, чтобы созданное промо сразу
 * попало в видимый год календаря.
 */
export function makeRandomPromoDraft(year: number): Omit<PromoCalendarItem, "id"> {
	const channel = pick(CHANNEL_OPTIONS);
	const client = pick(CLIENT_OPTIONS);

	const yearStartMs = Date.UTC(year, 0, 1);
	const yearEndMs = Date.UTC(year, 11, 31);
	const totalDays = Math.round((yearEndMs - yearStartMs) / MS_DAY);

	const duration = MIN_DURATION_DAYS + Math.floor(Math.random() * (MAX_DURATION_DAYS - MIN_DURATION_DAYS + 1));
	const startDay = Math.floor(Math.random() * Math.max(1, totalDays - duration));
	const beginMs = yearStartMs + startDay * MS_DAY;
	const endMs = Math.min(beginMs + duration * MS_DAY, yearEndMs);

	return {
		title: pick(TITLES),
		dateBegin: toIso(beginMs),
		dateEnd: toIso(endMs),
		channelType: channel.value,
		channelId: channel.channelId,
		companyName: client.companyName,
		companyId: client.companyId
	};
}
