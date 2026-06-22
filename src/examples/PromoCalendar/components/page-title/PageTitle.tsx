import { cn } from "ics-ui-kit/lib/utils";

export function PageTitle({ children }: { children: React.ReactNode }) {
	return <h1 className={cn("text-2xl font-semibold tracking-tight text-primary-fg")}>{children}</h1>;
}
