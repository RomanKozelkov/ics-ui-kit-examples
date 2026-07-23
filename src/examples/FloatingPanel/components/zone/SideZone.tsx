import { Fragment } from "react";
import { Resizable } from "re-resizable";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ResizablePanel, ResizablePanelGroup } from "ics-ui-kit/components/resizable";
import { cn } from "ics-ui-kit/lib/utils";
import { useFloatingPanelStore } from "../../store/useFloatingPanelStore";
import { PanelConfig, SideZoneSide } from "../../types/FloatingPanelTypes";
import { SIDE_ZONE_MAX_WIDTH, SIDE_ZONE_MIN_WIDTH, SIDE_ZONE_PANEL_MIN_SIZE } from "../../constants";
import { Panel } from "../panel/Panel";
import { PanelResizeHandle } from "./PanelResizeHandle";

type SideZoneProps = {
	side: SideZoneSide;
	panels: PanelConfig[];
	isOver: boolean;
	className?: string;
};

export const SideZone = ({ side, panels, isOver, className }: SideZoneProps) => {
	const width = useFloatingPanelStore((state) => state.sideZoneWidths[side]);
	const setSideZoneWidth = useFloatingPanelStore((state) => state.setSideZoneWidth);
	const setIsOpen = useFloatingPanelStore((state) => state.setIsOpen);
	const isEmptyZoneOver = isOver && !panels.length;

	return (
		<Resizable
			size={{ width, height: "100%" }}
			minWidth={SIDE_ZONE_MIN_WIDTH}
			maxWidth={SIDE_ZONE_MAX_WIDTH}
			enable={{ left: side === "right", right: side === "left" }}
			onResizeStop={(_event, _direction, _ref, delta) => setSideZoneWidth(side, width + delta.width)}
		>
			<div
				className={cn(
					"relative m-2.5 h-[calc(100%-1rem)] rounded-2xl border border-transparent transition-colors",
					isEmptyZoneOver && "border-dashed border-muted"
				)}
			>
				{isEmptyZoneOver && (
					<div className="pointer-events-none absolute inset-0 z-20 rounded-2xl bg-alpha-high-90" />
				)}
				<SortableContext items={panels.map(({ id }) => id)} strategy={verticalListSortingStrategy}>
					<ResizablePanelGroup
						direction="vertical"
						autoSaveId={`side-zone-${side}`}
						style={{ overflow: "visible" }}
					>
						{panels.map(({ id, title }, index) => (
							<Fragment key={id}>
								{index > 0 && <PanelResizeHandle />}
								<ResizablePanel
									id={id}
									order={index}
									minSize={15}
									style={{ overflow: "visible", minHeight: 0 }}
								>
									<Panel id={id} title={title} onClose={() => setIsOpen(id, false)} />
								</ResizablePanel>
							</Fragment>
						))}
					</ResizablePanelGroup>
				</SortableContext>
			</div>
		</Resizable>
	);
};
