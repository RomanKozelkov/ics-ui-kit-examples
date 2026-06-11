import { ScrollShadowContainer } from "ics-ui-kit/components/scroll-shadow-container";
import { usePromoCalendarQuery } from "../../api/promo.queries";
import { Body } from "./ui/Body";
import { Header } from "./ui/Header";
import { usePromoLayout } from "./hooks/usePromoLayout";
import { ErrorState } from "ics-ui-kit/components/error-state";
import { Loader } from "ics-ui-kit/components/loader";

interface InnerProps {
	dateBegin: string;
	dateEnd: string;
	dayWidth: number;
}

export function PromoCalendar({ dateBegin, dateEnd, dayWidth }: InnerProps) {
	const { data, isLoading, isError } = usePromoCalendarQuery({ dateBegin, dateEnd });
	const { timeline, prepared, laneCount, totalW } = usePromoLayout(data ?? [], dateBegin, dateEnd, dayWidth);

	if (isLoading) return <Loader>Загрузка...</Loader>;

	if (isError) return <ErrorState>Ошибка загрузки данных</ErrorState>;

	return (
		<TableWrapper style={{ minWidth: totalW }}>
			<Header months={timeline.months} days={timeline.days} dayWidth={dayWidth} />
			<Body
				days={timeline.days}
				items={prepared}
				laneCount={laneCount}
				dayWidth={dayWidth}
				totalDays={timeline.totalDays}
			/>
		</TableWrapper>
	);
}

export function TableWrapper({ children, style }: { children: React.ReactNode; style: React.CSSProperties }) {
	return (
		<ScrollShadowContainer className="flex-1 overflow-auto">
			<div className="relative rounded-lg border border-border bg-primary-bg" style={style}>
				{children}
			</div>
		</ScrollShadowContainer>
	);
}
