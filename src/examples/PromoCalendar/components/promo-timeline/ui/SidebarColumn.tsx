import { useText } from "../../../i18n";
import { Z_INDEX } from "../utils/z-index";
import type { GroupNode } from "../utils/grouping";
import { SidebarGroup } from "./SidebarGroup";

type Props = {
	groups: GroupNode[];
	width: number;
	headerHeight: number;
	collapsedPaths: Set<string>;
	onToggle: (path: string) => void;
};

/**
 * Левая колонка (two-pane): собственная шапка + тело. Залипает по горизонтали (left:0),
 * заголовки секций — по вертикали внутри своих групп. Рекурсия и высоты совпадают с ContentGroup.
 */
export function SidebarColumn({ groups, width, headerHeight, collapsedPaths, onToggle }: Props) {
	const text = useText();

	if (width <= 0) return null;

	return (
		<div
			className="sticky left-0 flex shrink-0 flex-col border-r border-border bg-primary-bg"
			style={{ width, zIndex: Z_INDEX.corner }}
		>
			{/* Header: угловая ячейка с названием колонки группировки. */}
			<div
				className="sticky top-0 flex shrink-0 items-center border-b border-border bg-primary-bg px-2 text-xs font-medium text-muted-foreground"
				style={{ height: headerHeight, zIndex: Z_INDEX.corner }}
			>
				{text("calendar.group")}
			</div>

			{/* Body: зеркало контентных секций. */}
			{groups.map((group) => (
				<SidebarGroup
					key={group.path}
					group={group}
					depth={0}
					collapsedPaths={collapsedPaths}
					onToggle={onToggle}
					headerHeight={headerHeight}
					showOwnHeader
				/>
			))}
		</div>
	);
}
