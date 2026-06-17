import type { GroupNode } from "../utils/grouping";
import { groupStickyTop, resolveHeaderPlacement } from "../utils/rows";
import { ContentGroupBand } from "./ContentGroupBand";
import { LaneRow } from "./LaneRow";

type Props = {
	group: GroupNode;
	depth: number;
	collapsedPaths: Set<string>;
	headerHeight: number;
	showOwnHeader: boolean;
};

/**
 * Контентная половина секции группы. Каждая секция — отдельный containing block (relative),
 * поэтому её заголовок-полоса залипает только в пределах своей группы (iOS-style), а не всего столбца.
 */
export function ContentGroup({ group, depth, collapsedPaths, headerHeight, showOwnHeader }: Props) {
	const collapsed = collapsedPaths.has(group.path);
	const hasChildren = group.children.length > 0;
	const placement = resolveHeaderPlacement(group, showOwnHeader, collapsed);

	return (
		<div className="relative flex flex-col">
			{placement === "standalone" && <ContentGroupBand top={groupStickyTop(headerHeight, depth)} />}

			{!collapsed &&
				hasChildren &&
				group.children.map((child) => (
					<ContentGroup
						key={child.path}
						group={child}
						depth={depth + 1}
						collapsedPaths={collapsedPaths}
						headerHeight={headerHeight}
						showOwnHeader
					/>
				))}

			{!collapsed &&
				!hasChildren &&
				group.lanes.map((laneItems, i) => (
					<LaneRow
						key={`${group.path}::lane${i}`}
						rowId={`${group.path}::lane${i}`}
						items={laneItems}
						borderBottom={i === group.lanes.length - 1}
					/>
				))}
		</div>
	);
}
