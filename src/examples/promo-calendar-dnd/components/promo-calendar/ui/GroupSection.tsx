import type { GroupNode } from "../utils/grouping";
import { GroupHeaderRow } from "./GroupHeaderRow";
import { LaneRow } from "./LaneRow";

type Props = {
	group: GroupNode;
	depth: number;
	rangeStart: number;
	rangeEnd: number;
	collapsedPaths: Set<string>;
	onToggle: (path: string) => void;
	showOwnHeader: boolean;
};

export function GroupSection({ group, depth, rangeStart, rangeEnd, collapsedPaths, onToggle, showOwnHeader }: Props) {
	const collapsed = collapsedPaths.has(group.path);
	const hasChildren = group.children.length > 0;

	return (
		<>
			{showOwnHeader && (
				<GroupHeaderRow group={group} depth={depth} collapsed={collapsed} onToggle={() => onToggle(group.path)} />
			)}
			{!collapsed && hasChildren && (
				<>
					{group.children.map((child) => (
						<GroupSection
							key={child.path}
							group={child}
							depth={depth + 1}
							rangeStart={rangeStart}
							rangeEnd={rangeEnd}
							collapsedPaths={collapsedPaths}
							onToggle={onToggle}
							showOwnHeader
						/>
					))}
				</>
			)}
			{!collapsed && !hasChildren && (
				<>
					{group.lanes.map((laneItems, i) => (
						<LaneRow
							key={`${group.path}::lane${i}`}
							rowId={`${group.path}::lane${i}`}
							items={laneItems}
							rangeStart={rangeStart}
							rangeEnd={rangeEnd}
						/>
					))}
				</>
			)}
		</>
	);
}
