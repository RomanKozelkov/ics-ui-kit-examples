import { useMemo } from "react";
import type { GroupField, PromoItem, TimelineGroup, TimelineItem } from "../types";
import { colorForIndex } from "../utils/palette";
import { isoToMsUTC, daysBetween } from "../utils/date";
import { MS_DAY, SECTION_HEAD_H } from "../utils/constants";

const ALL_GROUP_ID = "__all";

type Args = {
	promos: PromoItem[];
	groupBy: GroupField | null;
	collapsed: Set<string>;
	rangeStart: number;
	rangeEnd: number;
};

type Result = {
	groups: TimelineGroup[];
	items: TimelineItem[];
};

export function useTimelineData({ promos, groupBy, collapsed, rangeStart, rangeEnd }: Args): Result {
	return useMemo(() => {
		// Готовим записи: режем по краям года, считаем длительность и флаги выхода за год.
		const prepared = promos
			.map((p) => {
				const rawStart = isoToMsUTC(p.dateBegin);
				const rawEnd = isoToMsUTC(p.dateEnd) + MS_DAY; // конец — эксклюзивный
				const start = Math.max(rawStart, rangeStart);
				const end = Math.min(rawEnd, rangeEnd);
				return {
					promo: p,
					start,
					end,
					overflowLeft: rawStart < rangeStart,
					overflowRight: rawEnd > rangeEnd,
					durationDays: daysBetween(start, end)
				};
			})
			.filter((x) => x.end > x.start)
			.sort((a, b) => a.start - b.start); // раньше — выше при стекинге

		// Группы.
		const groups: TimelineGroup[] = [];
		if (!groupBy) {
			groups.push({
				id: ALL_GROUP_ID,
				title: "Все промо",
				count: prepared.length,
				collapsible: false,
				collapsed: false,
				stackItems: true
			});
		} else {
			const counts = new Map<string, number>();
			for (const x of prepared) {
				const key = String(x.promo[groupBy] ?? "—");
				counts.set(key, (counts.get(key) ?? 0) + 1);
			}
			const keys = [...counts.keys()].sort((a, b) => a.localeCompare(b, "ru"));
			for (const key of keys) {
				const id = `g:${key}`;
				const isCollapsed = collapsed.has(id);
				groups.push({
					id,
					title: key,
					count: counts.get(key) ?? 0,
					collapsible: true,
					collapsed: isCollapsed,
					stackItems: true,
					height: isCollapsed ? SECTION_HEAD_H : undefined
				});
			}
		}

		// Элементы. Свёрнутые секции скрывают свои полоски.
		const items: TimelineItem[] = [];
		prepared.forEach((x, i) => {
			const groupId = groupBy ? `g:${String(x.promo[groupBy] ?? "—")}` : ALL_GROUP_ID;
			if (collapsed.has(groupId)) return;
			items.push({
				id: x.promo.id,
				group: groupId,
				title: x.promo.title,
				start_time: x.start,
				end_time: x.end,
				color: colorForIndex(i),
				durationDays: x.durationDays,
				overflowLeft: x.overflowLeft,
				overflowRight: x.overflowRight,
				brandName: x.promo.brandName,
				channelType: x.promo.channelType,
				skuName: x.promo.skuName
			});
		});

		return { groups, items };
	}, [promos, groupBy, collapsed, rangeStart, rangeEnd]);
}
