import type { SearchSelectOption } from "ics-ui-kit/components/search-select";

export type Grouping = "none" | "channel" | "client" | "brand";

export type SortBy = "startDateAsc" | "nameAsc";

/** Состояние панели управления (сохраняется в localStorage). */
export type PanelState = {
	/** Выбранный год (01.01–31.12 этого года). */
	year: number;
	/** Начальный месяц диапазона, 0–11. */
	monthFrom: number;
	/** Конечный месяц диапазона, 0–11. */
	monthTo: number;
	/** Группировка строк. */
	grouping: Grouping;
	/** Сортировка. */
	sort: SortBy;
	/** Фильтр по каналу. */
	channels: SearchSelectOption[];
	/** Фильтр по клиенту. */
	clients: SearchSelectOption[];
	/** Фильтр по бренду. */
	brands: SearchSelectOption[];
	/** Поиск по наименованию промо. */
	search: string;
};

export interface ManagementPanelProps {
	/** Вызывается при клике «Показать текущий день». */
	onShowToday?: () => void;
	className?: string;
}
