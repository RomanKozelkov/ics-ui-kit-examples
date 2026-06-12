export function Wrapper({ children }: { children: React.ReactNode }) {
	return <div className="flex h-full w-full flex-col overflow-hidden bg-primary-bg pb-2 pt-8">{children}</div>;
}

Wrapper.displayName = "PromoCalendar.Wrapper";

export function Header({ children }: { children: React.ReactNode }) {
	return <div className="container mx-auto flex shrink-0 items-center gap-4 pb-4">{children}</div>;
}

Header.displayName = "PromoCalendar.Header";

export function Body({ children }: { children: React.ReactNode }) {
	return <div className="container mx-auto flex min-h-0 flex-1 flex-col">{children}</div>;
}

Body.displayName = "PromoCalendar.Body";

export const Layout = {
	Wrapper,
	Header,
	Body
};
