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
	const [groupBy, setGroupBy] = useState<GroupField | null>(null);

	return (
		<QueryClientProvider client={queryClient}>
			<Layout.Wrapper>
				<Layout.Header>
					<PageTitle>Промо-календарь</PageTitle>
					<div className="ml-auto flex items-center gap-2 text-xs">
						<span className="text-muted-foreground">Группировка:</span>
						<GroupButton active={groupBy === null} onClick={() => setGroupBy(null)}>
							Без группировки
						</GroupButton>
						{GROUP_OPTIONS.map((field) => (
							<GroupButton
								key={field}
								active={groupBy === field}
								onClick={() => setGroupBy((prev) => (prev === field ? null : field))}
							>
								{GROUP_FIELD_LABEL[field]}
							</GroupButton>
						))}
					</div>
				</Layout.Header>
				<Layout.Body>
					<PromoCalendar dateBegin={rangeStart} dateEnd={rangeEnd} groupBy={groupBy} />
				</Layout.Body>
			</Layout.Wrapper>
		</QueryClientProvider>
	);
}

function GroupButton({
	active,
	onClick,
	children
}: {
	active: boolean;
	onClick: () => void;
	children: React.ReactNode;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={[
				"rounded-md border px-2 py-1 transition-colors",
				active
					? "border-primary bg-primary text-primary-foreground"
					: "border-border bg-primary-bg text-primary-fg hover:bg-muted/50"
			].join(" ")}
		>
			{children}
		</button>
	);
}
