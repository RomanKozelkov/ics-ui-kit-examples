import { Bell, MessageSquare, History } from "lucide-react";
import { GlassToolbar, GlassToolbarToggleGroup } from "ics-ui-kit/components/glass-toolbar";
import { useActiveDropSide } from "../hooks/useActiveDropSide";
import { useFloatingPanelStore } from "../store/useFloatingPanelStore";
import { PanelConfig, SideZoneSide } from "../types/FloatingPanelTypes";
import { PanelToggleButton } from "./PanelToggleButton";
import { PanelWindow } from "./PanelWindow";
import { SideZone } from "./zone/SideZone";

const PANELS: PanelConfig[] = [
	{ id: "history", title: "История", icon: History },
	{ id: "notifications", title: "Уведомления", icon: Bell },
	{ id: "comments", title: "Комментарии", icon: MessageSquare }
];

export const FloatingPanelZones = ({
	middleColumnRef
}: {
	middleColumnRef: React.RefObject<HTMLDivElement | null>;
}) => {
	const panels = useFloatingPanelStore((state) => state.panels);
	const activeDropSide = useActiveDropSide();

	const dockedPanels = (side: SideZoneSide) =>
		PANELS.filter((panel) => panels[panel.id].isOpen && panels[panel.id].dockedSide === side);

	const openPanelIds = PANELS.filter((panel) => panels[panel.id].isOpen).map((panel) => panel.id);

	return (
		<>
			<SideZone side="left" panels={dockedPanels("left")} isOver={activeDropSide === "left"} />

			<div ref={middleColumnRef} className="relative h-full flex-1">
				{PANELS.map((panel) => (
					<PanelWindow key={panel.id} {...panel} />
				))}
				<div className="absolute bottom-20 right-0">
					<GlassToolbar>
						<GlassToolbarToggleGroup type="multiple" value={openPanelIds}>
							{PANELS.map((panel) => (
								<PanelToggleButton key={panel.id} {...panel} />
							))}
						</GlassToolbarToggleGroup>
					</GlassToolbar>
				</div>
			</div>

			<SideZone side="right" panels={dockedPanels("right")} isOver={activeDropSide === "right"} />
		</>
	);
};
