import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { PromoCalendarContext, type PromoCalendarConfig } from "./PromoCalendarContext";
import { mockPromoApi } from "./api/mock/mock.api";
import { Layout } from "./components/layout/Layout";
import { PageTitle } from "./components/page-title/PageTitle";
import { PromoTimeline } from "./components/promo-timeline/PromoTimeline";
import type { GroupField } from "./components/promo-timeline/types";
import { ManagementPanel } from "./components/management-panel/panel-management";
import {
	createPanelStore,
	PanelStoreContext,
	usePanelStore,
	type Grouping
} from "./components/management-panel/store/panel.store";
import { TextProvider, textFromLocalDictionary, useText } from "./i18n";
import { selectDateRange } from "./components/management-panel/store/panel.selectors";
import { useShallow } from "zustand/react/shallow";
import { TooltipProvider } from "ics-ui-kit/components/tooltip";
import { Loader } from "ics-ui-kit/components/loader";
import { ErrorState } from "ics-ui-kit/components/error-state";
import { useYearsQuery } from "./api/promo.queries";

const defaultConfig: PromoCalendarConfig = {
	api: mockPromoApi,
	text: textFromLocalDictionary
};

function createQueryClient() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 1 * 60 * 1000,
				gcTime: 24 * 60 * 60 * 1000
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

/** Группировка панели → поля группировки календаря. */
const GROUPING_TO_FIELDS: Record<Grouping, GroupField[]> = {
	none: [],
	channel: ["channelType"],
	client: ["companyName"]
};

export function PromoCalendar() {
	const config = defaultConfig;
	const [queryClient] = useState(createQueryClient);

	return (
		<PromoCalendarContext.Provider value={config}>
			<TextProvider text={config.text}>
				<QueryClientProvider client={queryClient}>
					<TooltipProvider>
						<PromoCalendarApp />
					</TooltipProvider>
				</QueryClientProvider>
			</TextProvider>
		</PromoCalendarContext.Provider>
	);
}

// Список годов приходит с сервера — без него не построить стор (clamp года) и Select.
function PromoCalendarApp() {
	const text = useText();
	const { data: years, isLoading, isError } = useYearsQuery();

	if (isLoading) return <Loader>{text("calendar.loading")}</Loader>;
	if (isError || !years?.length) return <ErrorState>{text("calendar.error")}</ErrorState>;

	return <PromoCalendarShell years={years} />;
}

function PromoCalendarShell({ years }: { years: number[] }) {
	const text = useText();
	const [store] = useState(() => createPanelStore({ years }));

	return (
		<PanelStoreContext.Provider value={store}>
			<Layout.Wrapper>
				<Layout.Header>
					<PageTitle>{text("calendar.title")}</PageTitle>
					<ManagementPanel />
				</Layout.Header>
				<Layout.Body>
					<CalendarContainer />
				</Layout.Body>
			</Layout.Wrapper>
		</PanelStoreContext.Provider>
	);
}

function CalendarContainer() {
	const { dateBegin, dateEnd } = usePanelStore(useShallow(selectDateRange));
	const year = usePanelStore((s) => s.year);
	const grouping = usePanelStore((s) => s.grouping);
	const groupBy = GROUPING_TO_FIELDS[grouping];

	return <PromoTimeline year={year} dateBegin={dateBegin} dateEnd={dateEnd} groupBy={groupBy} />;
}
