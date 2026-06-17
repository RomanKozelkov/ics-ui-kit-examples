import { GROUP_HEAD_H, LANE_H, Z_INDEX } from "../utils/constants";
import type { GroupNode } from "../utils/grouping";
import { groupStickyTop, resolveHeaderPlacement } from "../utils/rows";
import { GroupHeaderButton } from "./GroupHeaderButton";

type Props = {
	group: GroupNode;
	depth: number;
	collapsedPaths: Set<string>;
	onToggle: (path: string) => void;
	headerHeight: number;
	showOwnHeader: boolean;
};

/**
 * Сайдбар-половина секции группы. Зеркалит структуру ContentGroup (та же рекурсия и высоты),
 * поэтому строки двух колонок совпадают. Заголовок секции — sticky внутри своего relative-блока.
 */
export function SidebarGroup({ group, depth, collapsedPaths, onToggle, headerHeight, showOwnHeader }: Props) {
	const collapsed = collapsedPaths.has(group.path);
	const hasChildren = group.children.length > 0;
	const placement = resolveHeaderPlacement(group, showOwnHeader, collapsed);

	return (
		<div className="relative flex flex-col">
			{placement === "standalone" && (
				<div
					className="sticky border-b border-border bg-primary-bg"
					style={{ height: GROUP_HEAD_H, top: groupStickyTop(headerHeight, depth), zIndex: Z_INDEX.sidebar }}
				>
					<div className="pointer-events-none absolute inset-0 bg-muted/40" />
					<div className="relative h-full">
						<GroupHeaderButton
							group={group}
							depth={depth}
							collapsed={collapsed}
							onToggle={() => onToggle(group.path)}
						/>
					</div>
				</div>
			)}

			{!collapsed &&
				hasChildren &&
				group.children.map((child) => (
					<SidebarGroup
						key={child.path}
						group={child}
						depth={depth + 1}
						collapsedPaths={collapsedPaths}
						onToggle={onToggle}
						headerHeight={headerHeight}
						showOwnHeader
					/>
				))}

			{!collapsed &&
				!hasChildren &&
				group.lanes.map((laneItems, i) => (
					<div
						key={`${group.path}::lane${i}`}
						className={`bg-primary-bg ${i === group.lanes.length - 1 ? "border-b border-border" : ""}`}
						style={{ height: LANE_H }}
					>
						{placement === "embedded" && i === 0 && (
							<GroupHeaderButton
								group={group}
								depth={depth}
								collapsed={collapsed}
								onToggle={() => onToggle(group.path)}
							/>
						)}
					</div>
				))}
		</div>
	);
}
