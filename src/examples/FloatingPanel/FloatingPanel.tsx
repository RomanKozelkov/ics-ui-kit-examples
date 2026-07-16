import { useRef } from "react";
import { DndContext, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core";
import { Bell, History, MessageSquare } from "lucide-react";
import { useFloatingPanelStore } from "./store/useFloatingPanelStore";
import { clampPosition } from "./utils/clampPosition";
import { PANEL_DEFAULT_WIDTH } from "./constants";
import { PanelConfig, PanelId } from "./types/FloatingPanelTypes";
import { PanelToggleButton } from "./components/PanelToggleButton";
import { PanelWindow } from "./components/PanelWindow";
import { SideZone } from "./components/zone/SideZone";

const PANELS: PanelConfig[] = [
	{ id: "history", title: "История", icon: History },
	{ id: "notifications", title: "Уведомления", icon: Bell },
	{ id: "comments", title: "Комментарии", icon: MessageSquare }
];

export const FloatingPanel = () => {
	const panels = useFloatingPanelStore((state) => state.panels);
	const setPosition = useFloatingPanelStore((state) => state.setPosition);
	const bringToFront = useFloatingPanelStore((state) => state.bringToFront);
	const dockPanel = useFloatingPanelStore((state) => state.dockPanel);
	const undockPanel = useFloatingPanelStore((state) => state.undockPanel);
	const middleColumnRef = useRef<HTMLDivElement>(null);

	const handleDragStart = (event: DragStartEvent) => {
		bringToFront(event.active.id as PanelId);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const id = event.active.id as PanelId;
		const dropSide = event.over?.id as "left" | "right" | undefined;

		if (dropSide === "left" || dropSide === "right") {
			dockPanel(id, dropSide);
			return;
		}

		if (panels[id].dockedSide) {
			const rect = event.active.rect.current.initial;
			const columnRect = middleColumnRef.current?.getBoundingClientRect();
			if (rect && columnRect) {
				undockPanel(id, {
					x: rect.left + event.delta.x - columnRect.left,
					y: rect.top + event.delta.y - columnRect.top
				});
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

	const dockedPanels = (side: "left" | "right") =>
		PANELS.filter((panel) => panels[panel.id].isOpen && panels[panel.id].dockedSide === side);

	return (
		<div className="relative flex h-screen w-full overflow-hidden">
			<DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
				<SideZone side="left" panels={dockedPanels("left")} />

				<div ref={middleColumnRef} className="relative h-full flex-1">
					{PANELS.map((panel) => (
						<PanelWindow key={panel.id} {...panel} />
					))}
					<div className="absolute bottom-20 right-40 flex flex-row gap-2">
						{PANELS.map((panel) => (
							<PanelToggleButton key={panel.id} {...panel} />
						))}
					</div>
				</div>

				<SideZone side="right" panels={dockedPanels("right")} />
			</DndContext>
		</div>
	);
};
