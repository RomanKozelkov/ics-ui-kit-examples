import { useDroppable } from "@dnd-kit/core";
import { Resizable } from "re-resizable";
import { SIDE_ZONE_MAX_WIDTH, SIDE_ZONE_MIN_WIDTH } from "../../constants";
import { useFloatingPanelStore } from "../../store/useFloatingPanelStore";
import { PanelConfig, SideZoneSide } from "../../types/FloatingPanelTypes";
import { cn } from "ics-ui-kit/lib/utils";
import { DockedPanel } from "./DockedPanel";

type SideZoneProps = {
	side: SideZoneSide;
	panels: PanelConfig[];
};

export const SideZone = ({ side, panels }: SideZoneProps) => {
	const width = useFloatingPanelStore((state) => state.sideZoneWidths[side]);
	const setSideZoneWidth = useFloatingPanelStore((state) => state.setSideZoneWidth);
	const panelsState = useFloatingPanelStore((state) => state.panels);
	const setIsOpen = useFloatingPanelStore((state) => state.setIsOpen);
	const { setNodeRef, isOver } = useDroppable({ id: side });

	const dockedPanel = panels.find((panel) => panelsState[panel.id].dockedIn === side && panelsState[panel.id].isOpen);

	return (
		<Resizable
			size={{ width, height: "100%" }}
			minWidth={SIDE_ZONE_MIN_WIDTH}
			maxWidth={SIDE_ZONE_MAX_WIDTH}
			enable={{ left: side === "right", right: side === "left" }}
			onResizeStop={(_event, _direction, _ref, delta) => setSideZoneWidth(side, width + delta.width)}
		>
			<div
				ref={setNodeRef}
				className={cn(
					"m-2 h-[calc(100%-1rem)] rounded-2xl border border-secondary-border bg-secondary-bg shadow-lg",
					isOver && "border-dotted border-muted bg-secondary-bg-hover"
				)}
			>
				{dockedPanel && (
					<DockedPanel
						id={dockedPanel.id}
						title={dockedPanel.title}
						onClose={() => setIsOpen(dockedPanel.id, false)}
					/>
				)}
			</div>
		</Resizable>
	);
};
