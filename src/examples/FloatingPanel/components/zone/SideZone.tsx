import { useDroppable } from "@dnd-kit/core";
import { Resizable } from "re-resizable";
import { cn } from "ics-ui-kit/lib/utils";
import { useFloatingPanelStore } from "../../store/useFloatingPanelStore";
import { PanelConfig, SideZoneSide } from "../../types/FloatingPanelTypes";
import { SIDE_ZONE_MAX_WIDTH, SIDE_ZONE_MIN_WIDTH } from "../../constants";
import { Panel } from "../panel/Panel";

type SideZoneProps = {
	side: SideZoneSide;
	panels: PanelConfig[];
};

export const SideZone = ({ side, panels }: SideZoneProps) => {
	const width = useFloatingPanelStore((state) => state.sideZoneWidths[side]);
	const setSideZoneWidth = useFloatingPanelStore((state) => state.setSideZoneWidth);
	const setIsOpen = useFloatingPanelStore((state) => state.setIsOpen);
	const { setNodeRef, isOver } = useDroppable({ id: side });

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
					"m-2 flex h-[calc(100%-1rem)] flex-col gap-2 overflow-y-auto rounded-2xl border border-secondary-border bg-secondary-bg shadow-lg transition-colors",
					isOver && "border-dashed border-muted bg-secondary-bg-hover"
				)}
			>
				{panels.map(({ id, title }) => (
					<Panel key={id} id={id} title={title} onClose={() => setIsOpen(id, false)} />
				))}
			</div>
		</Resizable>
	);
};
