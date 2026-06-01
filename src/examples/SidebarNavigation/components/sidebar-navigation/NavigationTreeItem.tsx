import { useNavigationTreeStore } from "../../store/navigationTreeStore";
import { NavigationTreeFolderRow } from "./NavigationTreeFolderRow";
import { NavigationIndicator } from "./NavigationIndicator";
import { SideMenuItemContent } from "./SideMenuItemContent";
import { SidebarInsertionLine } from "./sidebar-insertion-line/SidebarInsertionLine";
import { VerticalLineSegment } from "./sidebar-insertion-line/VerticalLineSegment";
import { DragInsertionLine } from "./sidebar-drag-drop/DragInsertionLine";
import { useInsertionProps } from "../../hooks/useInsertionProps";
import { useInsertionHover } from "../../hooks/useInsertionHover";
import { useInsertionAdd } from "../../hooks/useInsertionAdd";
import { useShowsInsertionLine } from "../../hooks/useShowsInsertionLine";
import { useDroppable } from "@dnd-kit/core";

interface NavigationTreeItemProps {
	id: string;
	level: number;
}

export function NavigationTreeItem({ id, level }: NavigationTreeItemProps) {
	const data = useNavigationTreeStore((s) => s.items[id]);
	const open = useNavigationTreeStore((s) => s.expanded.has(id));
	const isSelected = useNavigationTreeStore((s) => s.selectedId === id);
	const toggleExpanded = useNavigationTreeStore((s) => s.toggleExpanded);
	const select = useNavigationTreeStore((s) => s.select);
	const isNested = level > 1;

	const { minDepth, maxDepth, getParentId } = useInsertionProps(id, level, false);
	const handleParentHover = useInsertionHover(getParentId);
	const handleAdd = useInsertionAdd(id, getParentId);
	const showsLine = useShowsInsertionLine(id);

	const isDropAfter = useNavigationTreeStore((s) => s.dragTarget?.anchorId === id && s.dragTarget.mode === "after");
	const { setNodeRef } = useDroppable({ id });

	if (!data) return null;

	const childIds = data.children ?? [];
	const isFolder = childIds.length > 0;
	const indicator = data.indicator && <NavigationIndicator level={level} />;

	if (isFolder) {
		return (
			<NavigationTreeFolderRow
				id={id}
				level={level}
				data={data}
				open={open}
				onOpenChange={(next) => toggleExpanded(id, next)}
				isSelected={isSelected}
				onSelect={select}
				indicator={indicator}
				droppableRef={setNodeRef}
			>
				{childIds.map((childId) => (
					<NavigationTreeItem key={childId} id={childId} level={level + 1} />
				))}
			</NavigationTreeFolderRow>
		);
	}

	return (
		<div ref={setNodeRef} className="relative">
			{showsLine && <VerticalLineSegment />}
			<SideMenuItemContent
				id={id}
				isNested={isNested}
				data={data}
				isSelected={isSelected}
				onSelect={select}
				indicator={indicator}
			/>
			<SidebarInsertionLine
				minDepth={minDepth}
				maxDepth={maxDepth}
				level={level}
				onAdd={handleAdd}
				onParentHover={handleParentHover}
			/>
			{isDropAfter && <DragInsertionLine />}
		</div>
	);
}
