import { ChevronDown, ChevronRight } from "lucide-react";
import type { GroupNode } from "../utils/grouping";
import { GROUP_FIELD_LABEL } from "../types";
import { GROUP_HEAD_H, LEFT_W } from "../utils/constants";

type Props = {
	group: GroupNode;
	collapsed: boolean;
	onToggle: () => void;
};

export function GroupHeaderRow({ group, collapsed, onToggle }: Props) {
	return (
		<div className="flex w-full items-stretch border-b border-border bg-muted/40" style={{ height: GROUP_HEAD_H }}>
			<button
				type="button"
				onClick={onToggle}
				className="sticky left-0 z-[2] flex shrink-0 items-center gap-2 border-r border-border bg-muted/40 px-2 text-left text-xs font-medium text-primary-fg hover:bg-muted/60"
				style={{ width: LEFT_W, paddingLeft: 8 + group.depth * 12 }}
			>
				{collapsed ? <ChevronRight className="size-3.5 shrink-0" /> : <ChevronDown className="size-3.5 shrink-0" />}
				<span className="truncate">{group.label}</span>
				<span className="ml-auto shrink-0 text-muted-foreground">{group.count}</span>
				<span className="sr-only">{GROUP_FIELD_LABEL[group.field]}</span>
			</button>
			<div className="flex-1" />
		</div>
	);
}
