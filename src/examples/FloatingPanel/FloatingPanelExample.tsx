import { DndContext, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core";
import { Bell, History, MessageSquare } from "lucide-react";
import { useFloatingPanelStore } from "./store/useFloatingPanelStore";
import { FloatingPanel } from "./components/FloatingPanel";
import { clampPosition } from "./utils/clampPosition";
import { PANEL_WIDTH } from "./constants";
import { PanelConfig, PanelId } from "./types/FloatingPanelTypes";
import { PanelToggleButton } from "./components/PanelToggleButton";
import { PanelWindow } from "./components/PanelWindow";

const PANELS: PanelConfig[] = [
	{ id: "history", title: "История", icon: History },
	{ id: "notifications", title: "Уведомления", icon: Bell },
	{ id: "comments", title: "Комментарии", icon: MessageSquare }
];

export const FloatingPanelExample = () => {
	const panels = useFloatingPanelStore((state) => state.panels);
	const setPosition = useFloatingPanelStore((state) => state.setPosition);
	const bringToFront = useFloatingPanelStore((state) => state.bringToFront);

	const handleDragStart = (event: DragStartEvent) => {
		bringToFront(event.active.id as PanelId);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const id = event.active.id as PanelId;
		const position = panels[id].position;
		if (!position) return;
		setPosition(id, clampPosition({ x: position.x + event.delta.x, y: position.y + event.delta.y }, PANEL_WIDTH));
	};

	return (
		<div className="relative h-screen w-full overflow-hidden">
			<DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
				{PANELS.map((panel) => (
					<PanelWindow key={panel.id} {...panel} />
				))}
			</DndContext>
			<div className="absolute bottom-40 right-40 flex flex-row gap-2">
				{PANELS.map((panel) => (
					<PanelToggleButton key={panel.id} {...panel} />
				))}
			</div>
		</div>
	);
};
