import { useEffect, useMemo, useRef } from "react";
import { PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import type { DragStartEvent, DragMoveEvent, DragEndEvent } from "@dnd-kit/core";
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
	const dragTarget = useNavigationTreeStore((s) => s.dragTarget);

	const groupsContainerRef = useRef<HTMLDivElement>(null);
	const autoExpandTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const autoExpandTargetRef = useRef<string | null>(null);
	const pointerYRef = useRef<number>(0);

	useEffect(() => {
		const onPointerMove = (e: PointerEvent) => { pointerYRef.current = e.clientY; };
		window.addEventListener("pointermove", onPointerMove);
		return () => window.removeEventListener("pointermove", onPointerMove);
	}, []);

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

	const onDragStart = ({ active }: DragStartEvent) => {
		setDragging(String(active.id));
	};

	const onDragMove = ({ active, over }: DragMoveEvent) => {
		const pointerY = pointerYRef.current;

		if (!over) {
			const isBelowContainer =
				pointerY >= (groupsContainerRef.current?.getBoundingClientRect().bottom ?? Infinity);

			if (isBelowContainer) {
				const groupIds = items["__root"]?.children ?? [];
				const lastGroupId = groupIds[groupIds.length - 1];
				const draggedId = String(active.id);
				if (lastGroupId) {
					const invalid = draggedId === lastGroupId || isDescendant(items, draggedId, lastGroupId);
					setDragTarget(
						invalid ? null : { anchorId: `${lastGroupId}__last`, parentId: lastGroupId, mode: "last-child" }
					);
					cancelAutoExpand();
					return;
				}
			}

			setDragTarget(null);
			cancelAutoExpand();
			return;
		}

		const draggedId = String(active.id);
		const overId = String(over.id);

		const isFirstSlot = overId.endsWith("__first");
		const isLastSlot = overId.endsWith("__last");

		if (isFirstSlot || isLastSlot) {
			const mode = isFirstSlot ? "first-child" : "last-child";
			const suffix = isFirstSlot ? "__first" : "__last";
			const groupId = overId.slice(0, -suffix.length);
			const invalid = draggedId === groupId || isDescendant(items, draggedId, groupId);
			cancelAutoExpand();
			setDragTarget(invalid ? null : { anchorId: overId, parentId: groupId, mode });
			return;
		}

		if (overId === draggedId || isDescendant(items, draggedId, overId)) {
			setDragTarget(null);
			cancelAutoExpand();
			return;
		}

		const mode = getDropMode(pointerY, over.rect);
		const parentId = mode === "after" ? (parentMap[overId] ?? null) : null;
		setDragTarget({ anchorId: overId, parentId, mode });

		const isFolder = (items[overId]?.children?.length ?? 0) > 0;
		const isCollapsed = !expanded.has(overId);

		const canAutoExpand = mode === "into" && isFolder && isCollapsed;
		canAutoExpand ? scheduleAutoExpand(overId) : cancelAutoExpand();
	};

	const onDragEnd = ({ active }: DragEndEvent) => {
		if (dragTarget) {
			const movedName = items[String(active.id)]?.name ?? String(active.id);
			const anchorName = items[dragTarget.anchorId]?.name ?? dragTarget.anchorId;
			const parentName = dragTarget.parentId ? items[dragTarget.parentId]?.name : undefined;
			const label =
				dragTarget.mode === "into"
					? `"${movedName}" → внутрь "${anchorName}"`
					: dragTarget.mode === "last-child"
						? `"${movedName}" → последним в "${parentName}"`
						: dragTarget.mode === "first-child"
							? `"${movedName}" → первым в "${parentName}"`
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

	return { sensors, groupsContainerRef, onDragStart, onDragMove, onDragEnd, onDragCancel };
}
