import { memo } from "react";
import { GROUP_HEAD_H, LANE_H } from "../utils/layout";
import { Z_INDEX } from "../utils/z-index";
import type { GroupNode } from "../utils/grouping";
import { groupStickyTop, resolveHeaderPlacement } from "../utils/rows";
import { GroupHeaderButton } from "./GroupHeaderButton";
import { TreeConnector } from "./TreeConnector";

export const SidebarGroup = memo(function SidebarGroup({
	group,
	depth,
	collapsedPaths,
	onToggle,
	headerHeight,
	showOwnHeader
}: {
	group: GroupNode;
	depth: number;
	collapsedPaths: Set<string>;
	onToggle: (path: string) => void;
	headerHeight: number;
	showOwnHeader: boolean;
}) {
	const collapsed = collapsedPaths.has(group.path);
	const hasChildren = group.children.length > 0;
	const placement = resolveHeaderPlacement(group, showOwnHeader, collapsed);

	return (
		<div className="relative flex flex-col">
			{placement === "standalone" && (
				<div
					className="sticky border-b border-border"
					style={{ height: GROUP_HEAD_H, top: groupStickyTop(headerHeight, depth), zIndex: Z_INDEX.sidebar }}
				>
					<div className="pointer-events-none absolute inset-0" />
					<div className="relative flex h-full items-center">
						<GroupHeaderButton
							group={group}
							collapsed={collapsed}
							depth={depth}
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
				group.lanes.map((_, i) => (
					<div
						key={`${group.path}::lane${i}`}
						className={`relative flex items-center ${i === group.lanes.length - 1 ? "border-b border-border" : ""}`}
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
});
