import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { PromoCalendarContext, type PromoCalendarConfig } from "./PromoCalendarContext";
import { mockPromoApi } from "./api/promo.api";
import { Layout } from "./components/layout/Layout";
import { PageTitle } from "./components/page-title/PageTitle";
import { PromoCalendar } from "./components/promo-calendar";
import type { GroupField } from "./components/promo-calendar/types";
import { ManagementPanel } from "./components/managment-panel/panel-managment";
import {
	createPanelStore,
	PanelStoreContext,
	usePanelStore,
	type Grouping
} from "./components/managment-panel/store/panel.store";
import { TextProvider, textFromLocalDictionary } from "./i18n";
import { selectDateRange, useShallowDateRange } from "./components/managment-panel/store/panel.selectors";

const defaultConfig: PromoCalendarConfig = {
	years: [2024, 2025, 2026],
	api: mockPromoApi,
	text: textFromLocalDictionary
};

export function createQueryClient() {
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

export function PromoCalendarExample() {
	return <PromoCalendarDnd config={defaultConfig} />;
}

export function PromoCalendarDnd({ config }: { config: PromoCalendarConfig }) {
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
	const { dateBegin, dateEnd } = useShallowDateRange();
	const grouping = usePanelStore((s) => s.grouping);
	const groupBy = GROUPING_TO_FIELDS[grouping];

	return <PromoCalendar dateBegin={dateBegin} dateEnd={dateEnd} groupBy={groupBy} />;
}
