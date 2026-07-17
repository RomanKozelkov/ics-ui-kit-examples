import { Fragment } from "react";
import { useDroppable } from "@dnd-kit/core";
import { Resizable } from "re-resizable";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "ics-ui-kit/components/resizable";
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
					"m-2 h-[calc(100%-1rem)] overflow-hidden rounded-2xl transition-colors",
					panels.length > 0 && "border border-secondary-border bg-secondary-bg shadow-lg",
					isOver && "border border-dashed border-muted bg-secondary-bg-hover"
				)}
			>
				<ResizablePanelGroup direction="vertical" autoSaveId={`side-zone-${side}`}>
					{panels.map(({ id, title }, index) => (
						<Fragment key={id}>
							{index > 0 && <ResizableHandle />}
							<ResizablePanel id={id} order={index} minSize={15}>
								<Panel id={id} title={title} onClose={() => setIsOpen(id, false)} />
							</ResizablePanel>
						</Fragment>
					))}
				</ResizablePanelGroup>
			</div>
		</Resizable>
	);
};
