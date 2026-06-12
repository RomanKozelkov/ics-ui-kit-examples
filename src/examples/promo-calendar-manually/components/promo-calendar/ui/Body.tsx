import type { TimelineDay } from "../utils/timeline";
import type { GroupNode } from "../utils/grouping";
import { GridBackground } from "./GridBackground";
import { GroupSection } from "./GroupSection";

type Props = {
	days: TimelineDay[];
	groups: GroupNode[];
	dayWidth: number;
	totalDays: number;
	todayIndex: number | null;
	collapsedPaths: Set<string>;
	onToggle: (path: string) => void;
	isGrouped: boolean;
};

export function Body({ days, groups, dayWidth, totalDays, todayIndex, collapsedPaths, onToggle, isGrouped }: Props) {
	return (
		<div className="relative">
			<GridBackground days={days} dayWidth={dayWidth} todayIndex={todayIndex} />
			{groups.map((g) => (
				<GroupSection
					key={g.path}
					group={g}
					dayWidth={dayWidth}
					totalDays={totalDays}
					collapsedPaths={collapsedPaths}
					onToggle={onToggle}
					showOwnHeader={isGrouped}
				/>
			))}
		</div>
	);
}
