import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, useMemo, useState } from "react";
import { PromoCalendarContext, type PromoCalendarConfig } from "./PromoCalendarContext";
import { mockPromoApi } from "./api/mock/mock.api";
import { Layout } from "./components/layout/Layout";
import { PageTitle } from "./components/page-title/PageTitle";
import { PromoTimeline } from "./components/promo-timeline/PromoTimeline";
import { ManagementPanel } from "./components/management-panel/ManagementPanel";
import { PromoEditorProvider } from "./components/promo-editor/PromoEditorContext";
import { PromoEditorDialog } from "./components/promo-editor/PromoEditorDialog";
import { createPanelStore, PanelStoreContext, usePanelStore } from "./components/management-panel/store/panel.store";
import { mapGroupingToFields } from "./groupingAdapter";
import { TextProvider, textFromLocalDictionary, useText } from "./i18n";
import { selectDateRange } from "./components/management-panel/store/panel.selectors";
import { useShallow } from "zustand/react/shallow";
import { TooltipProvider } from "ics-ui-kit/components/tooltip";
import { CalendarError, CalendarLoader } from "./components/feedback/CalendarFeedback";
import { useYearsSuspenseQuery } from "./api/promo.queries";

const defaultConfig: PromoCalendarConfig = {
	api: mockPromoApi,
	text: textFromLocalDictionary,
	locale: "ru"
};

const STALE_TIME_MS = 60 * 1000;
const GC_TIME_MS = 24 * 60 * 60 * 1000;

function createQueryClient() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: STALE_TIME_MS,
				gcTime: GC_TIME_MS
			}
		},
		mutationCache: new MutationCache({
			onSuccess: (_, __, ___, mutation) => {
				const keys = mutation.meta?.invalidateKeys;
				if (Array.isArray(keys)) {
					keys.forEach((queryKey) => queryClient.invalidateQueries({ queryKey }));
				}
			}
		})
	});
	return queryClient;
}

export function PromoCalendar() {
	const [queryClient] = useState(createQueryClient);

	return (
		<PromoCalendarContext.Provider value={defaultConfig}>
			<TextProvider text={defaultConfig.text} locale={defaultConfig.locale}>
				<QueryClientProvider client={queryClient}>
					<TooltipProvider>
						<Suspense fallback={<CalendarLoader />}>
							<PromoCalendarApp />
						</Suspense>
					</TooltipProvider>
				</QueryClientProvider>
			</TextProvider>
		</PromoCalendarContext.Provider>
	);
}

// TODO: rename
function PromoCalendarApp() {
	const { data: years, refetch } = useYearsSuspenseQuery();
	const text = useText();
	const [store] = useState(() => createPanelStore({ years }));

	if (!years.length) return <CalendarError onRetry={() => refetch()} />;

	return (
		<PanelStoreContext.Provider value={store}>
			<PromoEditorProvider>
				<Layout.Wrapper>
					<Layout.Header>
						<PageTitle>{text("calendar.title")}</PageTitle>
						<ManagementPanel />
					</Layout.Header>
					<Layout.Body>
						<CalendarContainer />
					</Layout.Body>
				</Layout.Wrapper>
				<PromoEditorDialog />
			</PromoEditorProvider>
		</PanelStoreContext.Provider>
	);
}

function CalendarContainer() {
	const { dateBegin, dateEnd } = usePanelStore(useShallow(selectDateRange));
	const year = usePanelStore((s) => s.year);
	const grouping = usePanelStore((s) => s.grouping);
	const groupBy = useMemo(() => mapGroupingToFields(grouping), [grouping]);

	return <PromoTimeline year={year} dateBegin={dateBegin} dateEnd={dateEnd} groupBy={groupBy} />;
}
