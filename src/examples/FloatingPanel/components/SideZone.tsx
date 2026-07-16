import { Resizable } from "re-resizable";
import { SIDE_ZONE_MAX_WIDTH, SIDE_ZONE_MIN_WIDTH } from "../constants";
import { useFloatingPanelStore } from "../store/useFloatingPanelStore";
import { SideZoneSide } from "../types/FloatingPanelTypes";

type SideZoneProps = SideZoneSide;

export const SideZone = ({ side }: SideZoneProps) => {
	const width = useFloatingPanelStore((state) => state.sideZoneWidths[side]);
	const setSideZoneWidth = useFloatingPanelStore((state) => state.setSideZoneWidth);

	return (
		<Resizable
			size={{ width, height: "100%" }}
			minWidth={SIDE_ZONE_MIN_WIDTH}
			maxWidth={SIDE_ZONE_MAX_WIDTH}
			enable={{ left: side === "right", right: side === "left" }}
			onResizeStop={(_event, _direction, _ref, delta) => setSideZoneWidth(side, width + delta.width)}
		>
			<div className="m-2 h-[calc(100%-1rem)] rounded-2xl border border-secondary-border bg-secondary-bg shadow-lg" />
		</Resizable>
	);
};
