import { useCallback, useEffect, useMemo, useState } from "react";
import { TimelineContext, useTimelineContext, useTimelineMonitor, type Range, type OnRangeChanged } from "dnd-timeline";
import type { Modifier } from "@dnd-kit/core";
import { ErrorState } from "ics-ui-kit/components/error-state";
import { Loader } from "ics-ui-kit/components/loader";
import { ScrollShadowContainer } from "ics-ui-kit/components/scroll-shadow-container";
import { usePromoCalendarQuery, type PromoData } from "../../api/promo.queries";
import { useGroupedRows } from "./hooks/useGroupedRows";
import { GroupSection } from "./ui/GroupSection";
import { GridBackground } from "./ui/GridBackground";
import { TimelineHeader } from "./ui/TimelineHeader";
import { LEFT_W, MS_DAY } from "./utils/constants";
import { getTimelineModel } from "./utils/timeline";
import { msToISO } from "./utils/date";
import type { GroupField } from "./types";

interface Props {
	dateBegin: string;
	dateEnd: string;
	groupBy?: GroupField[];
}

const restrictHorizontal: Modifier = ({ transform }) => ({ ...transform, y: 0 });

export function PromoCalendar({ dateBegin, dateEnd, groupBy = [] }: Props) {
	const { data, isLoading, isError } = usePromoCalendarQuery({ dateBegin, dateEnd });

	const timeline = useMemo(() => getTimelineModel(dateBegin, dateEnd), [dateBegin, dateEnd]);
	const [range, setRange] = useState<Range>(() => ({ start: timeline.startMs, end: timeline.endMs }));
	useEffect(() => {
		setRange({ start: timeline.startMs, end: timeline.endMs });
	}, [timeline.startMs, timeline.endMs]);

	const [overrides, setOverrides] = useState<Record<string, { dateBegin: string; dateEnd: string }>>({});
	const items = useMemo<PromoData[]>(() => {
		if (!data) return [];
		return data.map((p) => {
			const o = overrides[p.id];
			if (!o) return p;
			const startMs = new Date(o.dateBegin).getTime();
			const endMs = new Date(o.dateEnd).getTime();
			const durationDays = Math.round((endMs - startMs) / MS_DAY) + 1;
			return { ...p, ...o, durationDays };
		});
	}, [data, overrides]);

	const groups = useGroupedRows(items, groupBy);
	const onResizeEnd = useCallback(() => {}, []);
	const onRangeChanged = useCallback<OnRangeChanged>((updater) => setRange(updater), []);

	if (isLoading) return <Loader>Загрузка...</Loader>;
	if (isError) return <ErrorState>Ошибка загрузки данных</ErrorState>;

	return (
		<TimelineContext
			range={range}
			sidebarWidth={LEFT_W}
			onResizeEnd={onResizeEnd}
			onRangeChanged={onRangeChanged}
			rangeGridSizeDefinition={MS_DAY}
			modifiers={[restrictHorizontal]}
		>
			<CalendarSurface
				timeline={timeline}
				groups={groups}
				onItemMoved={(id, startMs, endMs) =>
					setOverrides((prev) => ({
						...prev,
						[id]: { dateBegin: msToISO(startMs), dateEnd: msToISO(endMs - MS_DAY) }
					}))
				}
			/>
		</TimelineContext>
	);
}

type SurfaceProps = {
	timeline: ReturnType<typeof getTimelineModel>;
	groups: ReturnType<typeof useGroupedRows>;
	onItemMoved: (id: string, startMs: number, endMs: number) => void;
};

function CalendarSurface({ timeline, groups, onItemMoved }: SurfaceProps) {
	const { setTimelineRef, style, getSpanFromDragEvent } = useTimelineContext();
	const [collapsedPaths, setCollapsedPaths] = useState<Set<string>>(() => new Set());

	useTimelineMonitor({
		onDragEnd: (event) => {
			const span = getSpanFromDragEvent(event);
			if (!span) return;
			onItemMoved(String(event.active.id), span.start, span.end);
		}
	});

	const onToggle = useCallback((path: string) => {
		setCollapsedPaths((prev) => {
			const next = new Set(prev);
			if (next.has(path)) next.delete(path);
			else next.add(path);
			return next;
		});
	}, []);

	const isGrouped = groups.length > 1 || (groups[0] && groups[0].children.length > 0);

	return (
		<ScrollShadowContainer className="flex-1 overflow-auto">
			<div
				ref={setTimelineRef}
				style={{ ...style, overflow: "visible", minWidth: "100%" }}
				className="relative rounded-lg border border-border bg-primary-bg"
			>
				<TimelineHeader timeline={timeline} />
				<div className="relative">
					<GridBackground timeline={timeline} />
					{groups.map((g) => (
						<GroupSection
							key={g.path}
							group={g}
							depth={0}
							rangeStart={timeline.startMs}
							rangeEnd={timeline.endMs}
							collapsedPaths={collapsedPaths}
							onToggle={onToggle}
							showOwnHeader={isGrouped}
						/>
					))}
				</div>
			</div>
		</ScrollShadowContainer>
	);
}
