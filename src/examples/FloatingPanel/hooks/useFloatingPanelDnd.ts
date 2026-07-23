import { RefObject } from "react";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { useFloatingPanelStore } from "../store/useFloatingPanelStore";
import { clampPosition } from "../utils/clampPosition";
import { getEdgeDropSide } from "../utils/getEdgeDropSide";
import { PANEL_DEFAULT_WIDTH } from "../constants";
import { PanelId } from "../types/FloatingPanelTypes";

export const useFloatingPanelDnd = (middleColumnRef: RefObject<HTMLDivElement | null>) => {
	const panels = useFloatingPanelStore((state) => state.panels);
	const zoneOrder = useFloatingPanelStore((state) => state.zoneOrder);
	const setPosition = useFloatingPanelStore((state) => state.setPosition);
	const bringToFront = useFloatingPanelStore((state) => state.bringToFront);
	const dockPanel = useFloatingPanelStore((state) => state.dockPanel);
	const undockPanel = useFloatingPanelStore((state) => state.undockPanel);
	const reorderZone = useFloatingPanelStore((state) => state.reorderZone);

	const handleDragStart = (event: DragStartEvent) => {
		bringToFront(event.active.id as PanelId);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const id = event.active.id as PanelId;
		const dockedSide = panels[id].dockedSide;
		const overId = event.over?.id as PanelId | undefined;

		if (dockedSide && overId && overId !== id && zoneOrder[dockedSide].includes(overId)) {
			reorderZone(dockedSide, id, overId);
			return;
		}

		const rect = event.active.rect.current.translated;
		const dropSide = rect && getEdgeDropSide(rect, window.innerWidth);

		if (dropSide) {
			dockPanel(id, dropSide);
			return;
		}

		if (panels[id].dockedSide) {
			const columnRect = middleColumnRef.current?.getBoundingClientRect();
			if (rect && columnRect) {
				undockPanel(
					id,
					clampPosition({ x: rect.left - columnRect.left, y: rect.top - columnRect.top }, PANEL_DEFAULT_WIDTH)
				);
			}
			return;
		}

		const position = panels[id].position;
		if (!position) return;
		setPosition(
			id,
			clampPosition({ x: position.x + event.delta.x, y: position.y + event.delta.y }, PANEL_DEFAULT_WIDTH)
		);
	};

	return { handleDragStart, handleDragEnd };
};
