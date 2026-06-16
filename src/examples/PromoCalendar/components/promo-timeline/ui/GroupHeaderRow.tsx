import { useTimelineContext } from "dnd-timeline";
import { ChevronDown, ChevronRight } from "lucide-react";
import { GROUP_HEAD_H } from "../utils/constants";
import { GROUP_FIELD_TEXT_KEY } from "../types";
import { useText } from "../../../i18n";
import type { GroupNode } from "../utils/grouping";

type Props = {
	group: GroupNode;
	depth: number;
	collapsed: boolean;
	onToggle: () => void;
};

export function GroupHeaderRow({ group, depth, collapsed, onToggle }: Props) {
	const { sidebarWidth } = useTimelineContext();
	const text = useText();

	return (
		<div className="flex w-full items-stretch border-b border-border bg-muted/40" style={{ height: GROUP_HEAD_H }}>
			<button
				type="button"
				onClick={onToggle}
				className="sticky left-0 z-[3] flex items-center gap-2 bg-muted/40 px-2 text-left text-xs font-medium text-primary-fg hover:bg-muted/60"
				style={{ width: sidebarWidth, paddingLeft: 8 + depth * 12 }}
			>
				{collapsed ? <ChevronRight className="size-3.5" /> : <ChevronDown className="size-3.5" />}
				<span className="truncate">{group.label}</span>
				<span className="ml-auto shrink-0 text-muted-foreground">{group.count}</span>
				<span className="sr-only">{text(GROUP_FIELD_TEXT_KEY[group.field])}</span>
			</button>
			<div className="flex-1" />
		</div>
	);
}
