export const LEFT_W = 220;

export const LANE_H = 30;
export const BAR_H = 22;
export const BAR_RADIUS = 5;
/** Кегль текста промо-бара, px. Дробный — подобран под высоту бара (BAR_H), стандартные шаги Tailwind не подходят. */
export const BAR_FONT_PX = 11.5;
export const BAR_GAP = 4;
export const ROW_PAD = 4;

export const HEAD_MONTH_H = 30;
export const HEAD_DAY_H = 26;

/** Отступ залипающей метки месяца от левого края; прибавляется к ширине сайдбара,
 *  чтобы метку не перекрывал залипающий сайдбар «Группа». */
export const MONTH_LABEL_GAP = 8;

export const GROUP_HEAD_H = 32;

export const MS_DAY = 86_400_000;

/** Максимальная высота полотна, px; дальше включается вертикальный скролл. */
export const SURFACE_MAX_H = 400;

export const DAY_GRID_MIN_PX = 25;

/** Ширина зоны захвата у краёв промо-бара для ресайза, px. 0 — ресайз выключен. */
export const RESIZE_HANDLE_W = 8;

/**
 * Слои наложения по оси Z — единый источник правды
 *
 * Промо-бары собственный z не задают (itemStyle → z-auto): лежат в одном слое с сеткой,
 * но позже в DOM, поэтому рисуются поверх неё.
 */
export const Z_INDEX = {
	grid: 0, // фоновая сетка, полосы выходных
	today: 2, // маркер «сегодня» — поверх промо-баров (z-auto), но под залипающим сайдбаром/шапкой
	sidebar: 3, // залипающий левый сайдбар строк и шапок групп
	header: 4, // залипающая верхняя шапка с месяцами/днями
	corner: 5 // угловая ячейка — залипает и сверху, и слева
} as const;
