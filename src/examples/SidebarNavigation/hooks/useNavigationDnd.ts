import { useRef } from "react";
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

	const pointerYRef = useRef(0);
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

	const onPointerMove = (e: React.PointerEvent) => {
		pointerYRef.current = e.clientY;
	};

	const onDragStart = ({ active }: { active: { id: string | number } }) => {
		setDragging(String(active.id));
	};

	const onDragMove = ({ active, over }: DragMoveEvent) => {
		const draggedId = String(active.id);
		const overId = over ? String(over.id) : null;
		const { items, expanded } = useNavigationTreeStore.getState();

		if (!overId || overId === draggedId || isDescendant(items, draggedId, overId)) {
			setDragTarget(null);
			cancelAutoExpand();
			return;
		}

		const rect = over?.rect;
		if (!rect) return;
		const mode = getDropMode(pointerYRef.current, rect);

		const parentMap = getParentMap(items);
		const parentId = mode === "after" ? (parentMap[overId] ?? null) : null;

		setDragTarget({ anchorId: overId, parentId, mode });

		const isFolder = (items[overId]?.children?.length ?? 0) > 0;
		const isCollapsed = !expanded.has(overId);
		if (mode === "into" && isFolder && isCollapsed) {
			if (autoExpandTargetRef.current !== overId) {
				cancelAutoExpand();
				autoExpandTargetRef.current = overId;
				autoExpandTimerRef.current = setTimeout(() => {
					useNavigationTreeStore.getState().toggleExpanded(overId, true);
					autoExpandTimerRef.current = null;
				}, AUTO_EXPAND_DELAY_MS);
			}
		} else {
			cancelAutoExpand();
		}
	};

	const onDragEnd = ({ active }: DragEndEvent) => {
		const { dragTarget, items } = useNavigationTreeStore.getState();
		if (dragTarget) {
			const movedName = items[String(active.id)]?.name ?? String(active.id);
			const anchorName = items[dragTarget.anchorId]?.name ?? dragTarget.anchorId;
			const label =
				dragTarget.mode === "into"
					? `"${movedName}" → внутрь "${anchorName}"`
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

	return { sensors, onPointerMove, onDragStart, onDragMove, onDragEnd, onDragCancel };
}
