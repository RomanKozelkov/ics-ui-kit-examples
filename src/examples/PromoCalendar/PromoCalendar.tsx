import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { PromoCalendarContext, type PromoCalendarConfig } from "./PromoCalendarContext";
import { mockPromoApi } from "./api/promo.api";
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
import { TextProvider, textFromLocalDictionary } from "./i18n";
import { selectDateRange } from "./components/management-panel/store/panel.selectors";
import { useShallow } from "zustand/react/shallow";

const defaultConfig: PromoCalendarConfig = {
	years: [2024, 2025, 2026],
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
	client: ["companyName"],
	brand: ["brandName"]
};

function PromoCalendarDnd({ config }: { config: PromoCalendarConfig }) {
	const [store] = useState(() => createPanelStore({ years: config.years }));
	const [queryClient] = useState(createQueryClient);

	return (
		<PromoCalendarContext.Provider value={config}>
			<TextProvider text={config.text}>
				<QueryClientProvider client={queryClient}>
					<PanelStoreContext.Provider value={store}>
						<Layout.Wrapper>
							<Layout.Header>
								<PageTitle>{config.text("calendar.title")}</PageTitle>
								<ManagementPanel />
							</Layout.Header>
							<Layout.Body>
								<CalendarContainer />
							</Layout.Body>
						</Layout.Wrapper>
					</PanelStoreContext.Provider>
				</QueryClientProvider>
			</TextProvider>
		</PromoCalendarContext.Provider>
	);
}

function CalendarContainer() {
	const { dateBegin, dateEnd } = usePanelStore(useShallow(selectDateRange));
	const grouping = usePanelStore((s) => s.grouping);
	const groupBy = GROUPING_TO_FIELDS[grouping];

	return <PromoTimeline dateBegin={dateBegin} dateEnd={dateEnd} groupBy={groupBy} />;
}

export function PromoCalendar() {
	return <PromoCalendarDnd config={defaultConfig} />;
}
