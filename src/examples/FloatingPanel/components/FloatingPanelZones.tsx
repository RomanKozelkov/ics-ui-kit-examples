import { useMemo } from "react";
import { Bell, MessageSquare, History } from "lucide-react";
import { GlassToolbar, GlassToolbarToggleGroup } from "ics-ui-kit/components/glass-toolbar";
import { useActiveDropSide } from "../hooks/useActiveDropSide";
import { useFloatingPanelStore } from "../store/useFloatingPanelStore";
import { PanelConfig } from "../types/FloatingPanelTypes";
import { DocumentBackground } from "./DocumentBackground";
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

	const { leftDockedPanels, rightDockedPanels, openPanelIds } = useMemo(() => {
		const leftDockedPanels: PanelConfig[] = [];
		const rightDockedPanels: PanelConfig[] = [];
		const openPanelIds: PanelConfig["id"][] = [];

		PANELS.forEach((panel) => {
			const panelState = panels[panel.id];
			if (!panelState.isOpen) return;
			openPanelIds.push(panel.id);
			if (panelState.dockedSide === "left") leftDockedPanels.push(panel);
			if (panelState.dockedSide === "right") rightDockedPanels.push(panel);
		});

		return { leftDockedPanels, rightDockedPanels, openPanelIds };
	}, [panels]);

	return (
		<>
			<SideZone side="left" panels={leftDockedPanels} isOver={activeDropSide === "left"} className="mr-0" />

			<div ref={middleColumnRef} className="relative h-full flex-1">
				<DocumentBackground />
				{PANELS.map((panel) => (
					<PanelWindow key={panel.id} {...panel} />
				))}
				<div className="absolute bottom-20 right-0 z-10">
					<GlassToolbar>
						<GlassToolbarToggleGroup type="multiple" value={openPanelIds}>
							{PANELS.map((panel) => (
								<PanelToggleButton key={panel.id} {...panel} />
							))}
						</GlassToolbarToggleGroup>
					</GlassToolbar>
				</div>
			</div>

			<SideZone side="right" panels={rightDockedPanels} isOver={activeDropSide === "right"} className="ml-0" />
		</>
	);
};
