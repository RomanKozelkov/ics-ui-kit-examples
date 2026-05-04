import { Icon } from "ics-ui-kit/components/icon";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import { ReactNode } from "react";

export function NavigationTreeItemActions({ trigger }: { trigger?: ReactNode }) {
	return (
		<span className="ml-auto flex items-center gap-1">
			<button
				type="button"
				className="hover:bg-sidebar-accent group/actions hidden size-5 items-center justify-center rounded text-muted-foreground group-hover/nav:flex group-data-[active=true]/nav:flex"
				onClick={(e) => e.stopPropagation()}
			>
				<Icon icon={MoreHorizontal} className="size-3.5 group-hover/actions:text-primary-fg" />
			</button>
			{trigger}
		</span>
	);
}
