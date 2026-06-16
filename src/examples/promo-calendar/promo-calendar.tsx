import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { DAY_W_DEFAULT } from "./components/promo-calendar/utils/constants";
import { Layout } from "./components/layout/Layout";
import { PageTitle } from "./components/page-title/PageTitle";
import { PromoCalendar } from "./components/promo-calendar/PromoCalendar";

export function PromoCalendarPage({ dayWidth = DAY_W_DEFAULT }: { dayWidth?: number }) {
	const [rangeStart] = useState(() => `${new Date().getFullYear()}-01-01`);
	const [rangeEnd] = useState(() => `${new Date().getFullYear()}-12-31`);
	const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 60_000 } } }));

	return (
		<QueryClientProvider client={queryClient}>
			<Layout.Wrapper>
				<Layout.Header>
					<PageTitle>Промо-календарь</PageTitle>
				</Layout.Header>
				<Layout.Body>
					<PromoCalendar dateBegin={rangeStart} dateEnd={rangeEnd} dayWidth={dayWidth} />
				</Layout.Body>
			</Layout.Wrapper>
		</QueryClientProvider>
	);
}
