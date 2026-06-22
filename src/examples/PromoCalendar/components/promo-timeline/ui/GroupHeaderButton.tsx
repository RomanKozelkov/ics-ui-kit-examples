import { GROUP_FIELD_TEXT_KEY } from "../types";
import { useText } from "../../../i18n";
import type { GroupNode } from "../utils/grouping";

export function GroupHeaderButton({
	group,
	depth,
	collapsed,
	onToggle
}: {
	group: GroupNode;
	depth: number;
	collapsed: boolean;
	onToggle: () => void;
}) {
	const text = useText();

	return (
		<button
			type="button"
			onClick={onToggle}
			className="flex h-full w-full items-center gap-2 px-2 text-left text-xs font-medium text-primary-fg hover:bg-muted/20"
			style={{ paddingLeft: 8 + depth * 12 }}
		>
			<div className="flex size-[14px] shrink-0 items-center justify-center rounded-sm border border-border text-[9px] font-bold leading-none text-muted-foreground">
				{collapsed ? "+" : "−"}
			</div>
			<span className="truncate">{group.label}</span>
			<span className="ml-auto shrink-0 text-muted-foreground">{group.count}</span>
			{group.field && <span className="sr-only">{text(GROUP_FIELD_TEXT_KEY[group.field])}</span>}
		</button>
	);
}
