import { DndContext, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core";
import { Bell, History, MessageSquare } from "lucide-react";
import { useFloatingPanelStore } from "./store/useFloatingPanelStore";
import { clampPosition } from "./utils/clampPosition";
import { PANEL_DEFAULT_WIDTH } from "./constants";
import { PanelConfig, PanelId, SideZoneSide } from "./types/FloatingPanelTypes";
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
	const setDockedIn = useFloatingPanelStore((state) => state.setDockedIn);
	const bringToFront = useFloatingPanelStore((state) => state.bringToFront);

	const handleDragStart = (event: DragStartEvent) => {
		bringToFront(event.active.id as PanelId);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const id = event.active.id as PanelId;
		const overId = event.over?.id;

		if (overId === "left" || overId === "right") {
			setDockedIn(id, overId);
			return;
		}

		const wasDocked = panels[id].dockedIn !== null;
		if (wasDocked) setDockedIn(id, null);

		const position = panels[id].position;
		const nextPosition =
			wasDocked || !position ? { x: 0, y: 0 } : { x: position.x + event.delta.x, y: position.y + event.delta.y };

		setPosition(id, clampPosition(nextPosition, PANEL_DEFAULT_WIDTH));
	};

	return (
		<div className="relative flex h-screen w-full overflow-hidden">
			<DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
				<SideZone side="left" panels={PANELS} />

				<div className="relative h-full flex-1">
					{PANELS.map((panel) => (
						<PanelWindow key={panel.id} {...panel} />
					))}
					<div className="absolute bottom-20 right-40 flex flex-row gap-2">
						{PANELS.map((panel) => (
							<PanelToggleButton key={panel.id} {...panel} />
						))}
					</div>
				</div>

				<SideZone side="right" panels={PANELS} />
			</DndContext>
		</div>
	);
};
