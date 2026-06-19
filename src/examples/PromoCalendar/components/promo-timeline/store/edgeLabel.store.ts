import { create } from "zustand";

/** Координаты в viewport (position: fixed): x — край бара, y — линия привязки (верх/низ бара). */
export type EdgeLabel = {
	x: number;
	y: number;
	text: string;
	/** Чип под баром (нет места сверху): y = низ бара, иначе y = верх бара. */
	flip: boolean;
};

type EdgeLabelStore = {
	label: EdgeLabel | null;
	show: (label: EdgeLabel) => void;
	hide: () => void;
};

/**
 * Состояние плавающей подсказки даты края (как в Notion). Живёт ВНЕ промо-баров: бары пишут сюда
 * императивно (getState().show/hide), не подписываясь, поэтому их ресайз/drag не вызывает ререндер.
 * Подписан только единственный оверлей EdgeDateLabel.
 */
export const useEdgeLabelStore = create<EdgeLabelStore>((set) => ({
	label: null,
	show: (label) => set({ label }),
	hide: () => set({ label: null })
}));
