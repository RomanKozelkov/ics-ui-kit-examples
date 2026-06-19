import { useMemo } from "react";
import { useText, useLocale } from "../../../i18n";
import { buildGroupTree, isGrouped, type GroupNode } from "../utils/grouping";
import type { PreparedPromoItem, GroupField } from "../types";
import type { TimelineModel } from "../utils/timeline";

export function useTimelineGroups(
	prepared: PreparedPromoItem[],
	timeline: TimelineModel,
	groupBy: GroupField[]
): { groups: GroupNode[]; grouped: boolean } {
	const text = useText();
	const locale = useLocale();

	// Оставляем только промо, пересекающие видимое окно месяцев, — иначе группы/строки
	// плодились бы из записей вне диапазона.
	const visible = useMemo(
		() => prepared.filter((p) => p.startMs < timeline.endMs && p.endMs > timeline.startMs),
		[prepared, timeline.startMs, timeline.endMs]
	);

	const groups = useMemo(
		() => buildGroupTree(visible, groupBy, text("calendar.allPromos"), locale),
		[visible, groupBy, text, locale]
	);

	return { groups, grouped: isGrouped(groups) };
}
