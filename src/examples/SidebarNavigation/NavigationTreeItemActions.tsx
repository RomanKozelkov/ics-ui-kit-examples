import { Icon } from "ics-ui-kit/components/icon";
import { ChevronRight, MoreHorizontal } from "lucide-react";

export function NavigationTreeItemActions({ showChevron = false }: { showChevron?: boolean }) {
	return (
		<span className="ml-auto flex items-center gap-1">
			<button
				type="button"
				className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hidden size-5 items-center justify-center rounded text-muted-foreground group-hover/nav:flex group-data-[active=true]/nav:flex"
				onClick={(e) => e.stopPropagation()}
			>
				<Icon icon={MoreHorizontal} className="size-3.5" />
			</button>
			{showChevron && (
				<span className="flex size-4 items-center justify-center text-muted-foreground hover:text-primary-fg">
					<Icon
						icon={ChevronRight}
						size="sm"
						className="shrink-0 text-muted transition-transform group-data-[state=open]/sidebar-menu:rotate-90"
					/>
				</span>
			)}
		</span>
	);
}
