import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { PromoCalendarContext, type PromoCalendarConfig } from "./PromoCalendarContext";
import { mockPromoApi } from "./api/promo.api";
import { Layout } from "./components/layout/Layout";
import { PageTitle } from "./components/page-title/PageTitle";
import { PromoCalendar } from "./components/promo-calendar";
import type { GroupField } from "./components/promo-calendar/types";
import { ManagementPanel } from "./components/managment-panel/panel-managment";
import { createPanelStore, PanelStoreContext, usePanelStore, selectDateRange, type Grouping } from "./components/managment-panel/store/usePanelStore";
import { TextProvider, dictionaryText } from "./i18n";


const defaultConfig: PromoCalendarConfig = {
	years: [2024, 2025, 2026],
	locale: "ru",
	api: mockPromoApi,
	text: dictionaryText
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

export function PromoCalendarDnd({ config }: {
	config?: Partial<PromoCalendarConfig>;
}= {}) {
	const cfg = useMemo<PromoCalendarConfig>(() => ({ ...defaultConfig, ...config }), [config]);
	const [store] = useState(() => createPanelStore({ years: cfg.years }));
	const [queryClient] = useState(createQueryClient);

	return (
		<PromoCalendarContext.Provider value={cfg}>
			<TextProvider text={cfg.text}>
				<QueryClientProvider client={queryClient}>
					<PanelStoreContext.Provider value={store}>
						<Layout.Wrapper>
							<Layout.Header>
								<PageTitle>{cfg.text("calendar.title")}</PageTitle>
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

	return <PromoCalendar dateBegin={dateBegin} dateEnd={dateEnd} groupBy={groupBy} />;
}
