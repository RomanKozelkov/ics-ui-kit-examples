import { colorForIndex } from "./palette";
import { dayNumFromISO } from "./date";
import type { PromoData } from "../../../api/promo.queries";
import type { PreparedPromo } from "../types";

export type { PreparedPromo };

/**
 * Раскладывает промо на ось таймлайна: считает колонки начала/конца, флаги обрезки,
 * назначает цвет. Возвращает только промо, пересекающиеся с окном [0, totalDays).
 * Дорожки (lanes) здесь НЕ считаются — это делает grouping на уровне листовой группы.
 */
export function prepareItems(items: PromoData[], startNum: number, totalDays: number): PreparedPromo[] {
	const all = items.map<PreparedPromo>((p, i) => {
		const beginIdx = dayNumFromISO(p.dateBegin) - startNum;
		const endIdx = dayNumFromISO(p.dateEnd) - startNum;
		return {
			...p,
			beginIdx,
			endIdx,
			overflowLeft: beginIdx < 0,
			overflowRight: endIdx > totalDays - 1,
			color: colorForIndex(i)
		};
	});

	return all.filter((p) => p.endIdx >= 0 && p.beginIdx < totalDays);
}
