import { useRef } from "react";
import { DndContext } from "@dnd-kit/core";
import { Bell, History, MessageSquare } from "lucide-react";
import { useFloatingPanelStore } from "./store/useFloatingPanelStore";
import { useFloatingPanelDnd } from "./hooks/useFloatingPanelDnd";
import { PanelConfig, SideZoneSide } from "./types/FloatingPanelTypes";
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
	const middleColumnRef = useRef<HTMLDivElement>(null);
	const { handleDragStart, handleDragEnd } = useFloatingPanelDnd(middleColumnRef);

	const dockedPanels = (side: SideZoneSide) =>
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
