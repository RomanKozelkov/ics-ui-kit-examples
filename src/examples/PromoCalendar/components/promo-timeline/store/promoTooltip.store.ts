import { create } from "zustand";
import type { PreparedPromoItem } from "../types";

/** Координаты в viewport (position: fixed): x — точка привязки по курсору, y — верх бара. */
export type PromoTooltip = {
	item: PreparedPromoItem;
	x: number;
	y: number;
};

type PromoTooltipStore = {
	tooltip: PromoTooltip | null;
	show: (tooltip: PromoTooltip) => void;
	hide: () => void;
};

/**
 * Состояние единственного hover-тултипа промо. Заменяет Radix Tooltip на каждом баре (их были
 * тысячи) одним always-mounted оверлеем (PromoHoverTooltip). Бары пишут сюда императивно
 * (getState().show/hide), не подписываясь, поэтому hover/drag не вызывает их ререндер.
 */
export const usePromoTooltipStore = create<PromoTooltipStore>((set) => ({
	tooltip: null,
	show: (tooltip) => set({ tooltip }),
	hide: () => set({ tooltip: null })
}));
