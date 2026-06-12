import { ChevronDown, ChevronRight } from "lucide-react";
import type { ReactCalendarGroupRendererProps } from "react-calendar-timeline";
import type { TimelineGroup } from "../types";

export function makeGroupRenderer(onToggle: (id: string) => void) {
	return function GroupSidebar({ group }: ReactCalendarGroupRendererProps<TimelineGroup>) {
		const { collapsible, collapsed, title, count } = group;

		const content = (
			<>
				{collapsible &&
					(collapsed ? (
						<ChevronRight className="size-3.5 shrink-0" />
					) : (
						<ChevronDown className="size-3.5 shrink-0" />
					))}
				<span className="truncate">{title}</span>
				<span className="ml-auto shrink-0 text-muted-foreground">{count}</span>
			</>
		);

		if (!collapsible) {
			return (
				<div className="flex h-full items-center gap-2 px-2 text-xs font-medium text-primary-fg">{content}</div>
			);
		}

		return (
			<button
				type="button"
				onClick={() => onToggle(group.id)}
				className="flex h-full w-full items-center gap-2 px-2 text-left text-xs font-medium text-primary-fg hover:bg-muted/40"
			>
				{content}
			</button>
		);
	};
}
