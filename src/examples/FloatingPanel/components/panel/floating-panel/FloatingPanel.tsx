import { useFloatingPanelDrag } from "../../../hooks/usePanelDrag";
import { useFloatingPanelStore } from "../../../store/useFloatingPanelStore";
import { SideZoneSide } from "../../../types/FloatingPanelTypes";
import { PanelProps } from "../Panel";
import { FloatingPanelView } from "./FloatingPanelView";

export const FloatingPanel = ({ id, title, onClose }: PanelProps) => {
	const position = useFloatingPanelStore((state) => state.panels[id].position);
	const zIndex = useFloatingPanelStore((state) => state.panels[id].zIndex);
	const bringToFront = useFloatingPanelStore((state) => state.bringToFront);
	const dockPanel = useFloatingPanelStore((state) => state.dockPanel);
	const drag = useFloatingPanelDrag(id);

	const handleDragStart = () => bringToFront(id);
	const handleDock = (side: SideZoneSide) => dockPanel(id, side);

	if (!position) return null;

	return (
		<FloatingPanelView
			id={id}
			title={title}
			position={position}
			zIndex={zIndex}
			drag={drag}
			onDragStart={handleDragStart}
			onClose={onClose}
			onDock={handleDock}
		/>
	);
};
