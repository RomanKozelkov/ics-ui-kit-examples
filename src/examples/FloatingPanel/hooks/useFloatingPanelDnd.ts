import { RefObject } from "react";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { useFloatingPanelStore } from "../store/useFloatingPanelStore";
import { clampPosition } from "../utils/clampPosition";
import { PANEL_DEFAULT_WIDTH } from "../constants";
import { PanelId, SideZoneSide } from "../types/FloatingPanelTypes";

export const useFloatingPanelDnd = (middleColumnRef: RefObject<HTMLDivElement | null>) => {
	const panels = useFloatingPanelStore((state) => state.panels);
	const setPosition = useFloatingPanelStore((state) => state.setPosition);
	const bringToFront = useFloatingPanelStore((state) => state.bringToFront);
	const dockPanel = useFloatingPanelStore((state) => state.dockPanel);
	const undockPanel = useFloatingPanelStore((state) => state.undockPanel);

	const handleDragStart = (event: DragStartEvent) => {
		bringToFront(event.active.id as PanelId);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const id = event.active.id as PanelId;
		const dropSide = event.over?.id as SideZoneSide | undefined;

		if (dropSide === "left" || dropSide === "right") {
			dockPanel(id, dropSide);
			return;
		}

		if (panels[id].dockedSide) {
			const rect = event.active.rect.current.translated;
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
