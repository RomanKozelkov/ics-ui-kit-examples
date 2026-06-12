import { useCallback, useState } from "react";
import { ScrollShadowContainer } from "ics-ui-kit/components/scroll-shadow-container";
import { ErrorState } from "ics-ui-kit/components/error-state";
import { Loader } from "ics-ui-kit/components/loader";
import { usePromoCalendarQuery } from "../../api/promo.queries";
import { usePromoCalendar } from "./hooks/usePromoLayout";
import { Header } from "./ui/Header";
import { Body } from "./ui/Body";
import { LEFT_W } from "./utils/constants";
import type { GroupField } from "./types";

interface Props {
	dateBegin: string;
	dateEnd: string;
	dayWidth: number;
	groupBy: GroupField[];
}

export function PromoCalendar({ dateBegin, dateEnd, dayWidth, groupBy }: Props) {
	const { data, isLoading, isError } = usePromoCalendarQuery({ dateBegin, dateEnd });
	const { timeline, groups, totalW, showDayNumbers, todayIndex } = usePromoCalendar(
		data ?? [],
		dateBegin,
		dateEnd,
		dayWidth,
		groupBy
	);

	const [collapsedPaths, setCollapsedPaths] = useState<Set<string>>(() => new Set());
	const onToggle = useCallback((path: string) => {
		setCollapsedPaths((prev) => {
			const next = new Set(prev);
			if (next.has(path)) next.delete(path);
			else next.add(path);
			return next;
		});
	}, []);

	if (isLoading) return <Loader>Загрузка...</Loader>;
	if (isError) return <ErrorState>Ошибка загрузки данных</ErrorState>;

	return (
		<ScrollShadowContainer className="flex-1 overflow-auto">
			<div
				className="relative w-max min-w-full rounded-lg border border-border bg-primary-bg"
				style={{ width: LEFT_W + totalW }}
			>
				<Header months={timeline.months} days={timeline.days} dayWidth={dayWidth} showDayNumbers={showDayNumbers} />
				<Body
					days={timeline.days}
					groups={groups}
					dayWidth={dayWidth}
					totalDays={timeline.totalDays}
					todayIndex={todayIndex}
					collapsedPaths={collapsedPaths}
					onToggle={onToggle}
					isGrouped={groupBy.length > 0}
				/>
			</div>
		</ScrollShadowContainer>
	);
}
