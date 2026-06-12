import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Layout } from "./components/layout/Layout";
import { PageTitle } from "./components/page-title/PageTitle";
import { PromoCalendar, type GroupField, GROUP_FIELD_LABEL } from "./components/promo-calendar";

const GROUP_OPTIONS: GroupField[] = ["channelType", "companyName", "brandName"];

export function PromoCalendarPage() {
	const [rangeStart] = useState(() => `${new Date().getFullYear()}-01-01`);
	const [rangeEnd] = useState(() => `${new Date().getFullYear()}-12-31`);
	const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 60_000 } } }));
	const [groupBy, setGroupBy] = useState<GroupField[]>([]);

	const toggle = (field: GroupField) =>
		setGroupBy((prev) => (prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]));

	return (
		<QueryClientProvider client={queryClient}>
			<Layout.Wrapper>
				<Layout.Header>
					<PageTitle>Промо-календарь</PageTitle>
					<div className="ml-auto flex items-center gap-2 text-xs">
						<span className="text-muted-foreground">Группировка:</span>
						{GROUP_OPTIONS.map((field) => {
							const idx = groupBy.indexOf(field);
							const active = idx >= 0;
							return (
								<button
									key={field}
									type="button"
									onClick={() => toggle(field)}
									className={[
										"rounded-md border px-2 py-1 transition-colors",
										active
											? "border-primary bg-primary text-primary-foreground"
											: "border-border bg-primary-bg text-primary-fg hover:bg-muted/50"
									].join(" ")}
								>
									{GROUP_FIELD_LABEL[field]}
									{active && groupBy.length > 1 && (
										<span className="ml-1 text-[10px] opacity-80">#{idx + 1}</span>
									)}
								</button>
							);
						})}
					</div>
				</Layout.Header>
				<Layout.Body>
					<PromoCalendar dateBegin={rangeStart} dateEnd={rangeEnd} groupBy={groupBy} />
				</Layout.Body>
			</Layout.Wrapper>
		</QueryClientProvider>
	);
}
