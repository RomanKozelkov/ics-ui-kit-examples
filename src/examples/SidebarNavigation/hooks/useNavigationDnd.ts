import { useMemo, useRef } from "react";
import { PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import type { DragMoveEvent, DragEndEvent } from "@dnd-kit/core";
import { useNavigationTreeStore } from "../store/navigationTreeStore";
import { isDescendant } from "../utils/isDescendant";
import { getParentMap } from "../utils/getParentMap";
import { DRAG_ACTIVATION_DISTANCE, AUTO_EXPAND_DELAY_MS } from "../utils/constants";
import { getDropMode } from "../utils/getDropMode";

export function useNavigationDnd() {
	const setDragging = useNavigationTreeStore((s) => s.setDragging);
	const setDragTarget = useNavigationTreeStore((s) => s.setDragTarget);
	const items = useNavigationTreeStore((s) => s.items);
	const expanded = useNavigationTreeStore((s) => s.expanded);
	const parentMap = useMemo(() => getParentMap(items), [items]);

	const autoExpandTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const autoExpandTargetRef = useRef<string | null>(null);

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: DRAG_ACTIVATION_DISTANCE } })
	);

	const cancelAutoExpand = () => {
		if (autoExpandTimerRef.current !== null) {
			clearTimeout(autoExpandTimerRef.current);
			autoExpandTimerRef.current = null;
		}
		autoExpandTargetRef.current = null;
	};

	const scheduleAutoExpand = (overId: string) => {
		if (autoExpandTargetRef.current === overId) return;
		cancelAutoExpand();
		autoExpandTargetRef.current = overId;
		autoExpandTimerRef.current = setTimeout(() => {
			useNavigationTreeStore.getState().toggleExpanded(overId, true);
			autoExpandTimerRef.current = null;
		}, AUTO_EXPAND_DELAY_MS);
	};

	const onDragStart = ({ active }: { active: { id: string | number } }) => {
		setDragging(String(active.id));
	};

	const onDragMove = ({ active, over }: DragMoveEvent) => {
		if (!over) return;

		const draggedId = String(active.id);
		const overId = String(over.id);

		if (overId.endsWith("__last")) {
			const groupId = overId.slice(0, -"__last".length);
			const invalid = draggedId === groupId || isDescendant(items, draggedId, groupId);
			cancelAutoExpand();
			setDragTarget(invalid ? null : { anchorId: overId, parentId: groupId, mode: "last-child" });
			return;
		}

		if (overId === draggedId || isDescendant(items, draggedId, overId)) {
			setDragTarget(null);
			cancelAutoExpand();
			return;
		}

		const translatedRect = active.rect.current.translated;
		if (!translatedRect) return;

		const pointerY = translatedRect.top + translatedRect.height / 2;
		const mode = getDropMode(pointerY, over.rect);
		const parentId = mode === "after" ? (parentMap[overId] ?? null) : null;
		setDragTarget({ anchorId: overId, parentId, mode });

		const isFolder = (items[overId]?.children?.length ?? 0) > 0;
		const isCollapsed = !expanded.has(overId);

		const canAutoExpand = mode === "into" && isFolder && isCollapsed;
		canAutoExpand ? scheduleAutoExpand(overId) : cancelAutoExpand();
	};

	const onDragEnd = ({ active }: DragEndEvent) => {
		const { dragTarget, items } = useNavigationTreeStore.getState();
		if (dragTarget) {
			const movedName = items[String(active.id)]?.name ?? String(active.id);
			const anchorName = items[dragTarget.anchorId]?.name ?? dragTarget.anchorId;
			const parentName = dragTarget.parentId ? items[dragTarget.parentId]?.name : undefined;
			const label =
				dragTarget.mode === "into"
					? `"${movedName}" → внутрь "${anchorName}"`
					: dragTarget.mode === "last-child"
						? `"${movedName}" → последним в "${parentName ?? anchorName}"`
						: `"${movedName}" → после "${anchorName}"`;
			console.log("Drop:", label);
		}
		cancelAutoExpand();
		setDragging(null);
		setDragTarget(null);
	};

	const onDragCancel = () => {
		cancelAutoExpand();
		setDragging(null);
		setDragTarget(null);
	};

	return { sensors, onDragStart, onDragMove, onDragEnd, onDragCancel };
}
