import type { GroupNode } from "../utils/grouping";
import { GroupHeaderRow } from "./GroupHeaderRow";
import { LaneRow } from "./LaneRow";

type Props = {
	group: GroupNode;
	dayWidth: number;
	totalDays: number;
	collapsedPaths: Set<string>;
	onToggle: (path: string) => void;
	showOwnHeader: boolean;
};

export function GroupSection({ group, dayWidth, totalDays, collapsedPaths, onToggle, showOwnHeader }: Props) {
	const collapsed = collapsedPaths.has(group.path);
	const hasChildren = group.children.length > 0;

	return (
		<>
			{showOwnHeader && (
				<GroupHeaderRow group={group} collapsed={collapsed} onToggle={() => onToggle(group.path)} />
			)}

			{!collapsed &&
				(hasChildren
					? group.children.map((child) => (
							<GroupSection
								key={child.path}
								group={child}
								dayWidth={dayWidth}
								totalDays={totalDays}
								collapsedPaths={collapsedPaths}
								onToggle={onToggle}
								showOwnHeader
							/>
						))
					: group.lanes.map((laneItems, i) => (
							<LaneRow
								key={`${group.path}::lane${i}`}
								items={laneItems}
								dayWidth={dayWidth}
								totalDays={totalDays}
							/>
						)))}
		</>
	);
}
