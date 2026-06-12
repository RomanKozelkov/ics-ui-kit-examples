import { useCallback, useMemo, useState } from "react";
import Timeline, {
	TimelineHeaders,
	SidebarHeader,
	DateHeader,
	TimelineMarkers,
	TodayMarker,
	type TimelineKeys,
	type IntervalRenderer
} from "react-calendar-timeline";
import "react-calendar-timeline/style.css";
import { ErrorState } from "ics-ui-kit/components/error-state";
import { Loader } from "ics-ui-kit/components/loader";
import { usePromoCalendarQuery } from "../../api/promo.queries";
import { useTimelineData } from "./hooks/useTimelineData";
import { renderPromoItem } from "./ui/PromoItemRenderer";
import { makeGroupRenderer } from "./ui/GroupSidebar";
import { DAY_NUMBER_MIN_PX, HEAD_DAY_H, HEAD_MONTH_H, LEFT_W, LINE_H, MS_DAY } from "./utils/constants";
import { isoToMsUTC } from "./utils/date";
import type { GroupField, TimelineGroup, TimelineItem } from "./types";
import "./styles.css";

const MONTHS_RU = [
	"Январь",
	"Февраль",
	"Март",
	"Апрель",
	"Май",
	"Июнь",
	"Июль",
	"Август",
	"Сентябрь",
	"Октябрь",
	"Ноябрь",
	"Декабрь"
];

const KEYS: TimelineKeys = {
	groupIdKey: "id",
	groupTitleKey: "title",
	groupRightTitleKey: "rightTitle",
	groupLabelKey: "title",
	itemIdKey: "id",
	itemTitleKey: "title",
	itemDivTitleKey: "title",
	itemGroupKey: "group",
	itemTimeStartKey: "start_time",
	itemTimeEndKey: "end_time"
};

interface Props {
	dateBegin: string;
	dateEnd: string;
	groupBy?: GroupField | null;
}

export function PromoCalendar({ dateBegin, dateEnd, groupBy = null }: Props) {
	const { data, isLoading, isError } = usePromoCalendarQuery({ dateBegin, dateEnd });

	const rangeStart = useMemo(() => isoToMsUTC(dateBegin), [dateBegin]);
	const rangeEnd = useMemo(() => isoToMsUTC(dateEnd) + MS_DAY, [dateEnd]);

	const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set());
	const onToggle = useCallback((id: string) => {
		setCollapsed((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	}, []);

	const { groups, items } = useTimelineData({
		promos: data ?? [],
		groupBy,
		collapsed,
		rangeStart,
		rangeEnd
	});

	const groupRenderer = useMemo(() => makeGroupRenderer(onToggle), [onToggle]);

	// Подсветка выходных и границ недель на канвасе.
	const verticalLineClassNamesForTime = useCallback((start: number) => {
		const dow = new Date(start).getUTCDay();
		const classes: string[] = [];
		if (dow === 0 || dow === 6) classes.push("promo-col-weekend");
		if (dow === 1) classes.push("promo-col-week-start");
		return classes;
	}, []);

	// Нижний уровень шапки: номер дня либо тонкая засечка при плотной сетке.
	const dayIntervalRenderer = useCallback(
		({ getIntervalProps, intervalContext }: IntervalRenderer<unknown>) => {
			const { interval, intervalText } = intervalContext;
			const showNumber = interval.labelWidth >= DAY_NUMBER_MIN_PX;
			const dow = interval.startTime.day();
			const isWeekend = dow === 0 || dow === 6;
			const { key, style, onClick } = getIntervalProps();
			return (
				<div
					key={key}
					onClick={onClick}
					className="flex items-center justify-center font-mono text-[11px] tabular-nums"
					style={{
						...style,
						color: isWeekend ? "var(--muted, #6b7280)" : "var(--primary-fg, #111)"
					}}
				>
					{showNumber ? intervalText : <span className="promo-day-tick" />}
				</div>
			);
		},
		[]
	);

	if (isLoading) return <Loader>Загрузка...</Loader>;
	if (isError) return <ErrorState>Ошибка загрузки данных</ErrorState>;

	return (
		<div className="promo-rct min-h-0 flex-1 overflow-auto rounded-lg border border-border bg-primary-bg">
			<Timeline<TimelineItem, TimelineGroup>
				groups={groups}
				items={items}
				keys={KEYS}
				defaultTimeStart={rangeStart}
				defaultTimeEnd={rangeEnd}
				sidebarWidth={LEFT_W}
				rightSidebarWidth={0}
				lineHeight={LINE_H}
				itemHeightRatio={0.74}
				stackItems
				canMove={false}
				canResize={false}
				canChangeGroup={false}
				canSelect={false}
				minZoom={7 * MS_DAY}
				maxZoom={400 * MS_DAY}
				itemRenderer={renderPromoItem}
				groupRenderer={groupRenderer}
				verticalLineClassNamesForTime={verticalLineClassNamesForTime}
			>
				<TimelineHeaders className="sticky top-0 z-[5]">
					<SidebarHeader>
						{({ getRootProps }) => (
							<div
								{...getRootProps()}
								className="flex items-center px-2 text-xs font-medium text-muted-foreground"
							>
								Группа
							</div>
						)}
					</SidebarHeader>
					<DateHeader
						unit="primaryHeader"
						height={HEAD_MONTH_H}
						labelFormat={([start]) => `${MONTHS_RU[start.month()]} ${start.year()}`}
					/>
					<DateHeader unit="day" height={HEAD_DAY_H} intervalRenderer={dayIntervalRenderer} />
				</TimelineHeaders>
				<TimelineMarkers>
					<TodayMarker>
						{({ styles }) => (
							<div
								className="promo-today-line"
								style={{ ...styles, width: 2, background: "var(--info, #2563eb)" }}
							/>
						)}
					</TodayMarker>
				</TimelineMarkers>
			</Timeline>
		</div>
	);
}
