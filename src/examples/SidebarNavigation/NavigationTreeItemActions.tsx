import { Icon } from "ics-ui-kit/components/icon";
import { MoreHorizontal } from "lucide-react";
import { ReactNode } from "react";

export function NavigationTreeItemActions({ trigger }: { trigger?: ReactNode }) {
	return (
		<span className="flex flex-1 items-center min-w-[40px]">
			{trigger}
			<span
				className="hover:bg-sidebar-accent group/actions ml-auto hidden size-5 items-center justify-center rounded text-muted-foreground group-hover/nav:flex group-data-[active=true]/nav:flex"
				onClick={(e) => e.stopPropagation()}
			>
				<Icon icon={MoreHorizontal} className="group-hover/actions:text-primary-fg" />
			</span>
		</span>
	);
}
