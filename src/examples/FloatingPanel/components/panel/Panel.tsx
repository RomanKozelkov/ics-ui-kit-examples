import { PanelId, SideZoneSide } from "../../types/FloatingPanelTypes";
import { useFloatingPanelStore } from "../../store/useFloatingPanelStore";
import { usePanelDrag } from "../../hooks/usePanelDrag";
import { clampPosition } from "../../utils/clampPosition";
import { PANEL_DEFAULT_WIDTH } from "../../constants";
import { DockedPanelView } from "./DockedPanelView";
import { FloatingPanelView } from "./FloatingPanelView";

type PanelProps = {
	id: PanelId;
	title: string;
	onClose: () => void;
};

export const Panel = ({ id, title, onClose }: PanelProps) => {
	const position = useFloatingPanelStore((state) => state.panels[id].position);
	const zIndex = useFloatingPanelStore((state) => state.panels[id].zIndex);
	const dockedSide = useFloatingPanelStore((state) => state.panels[id].dockedSide);
	const bringToFront = useFloatingPanelStore((state) => state.bringToFront);
	const dockPanel = useFloatingPanelStore((state) => state.dockPanel);
	const undockPanel = useFloatingPanelStore((state) => state.undockPanel);
	const drag = usePanelDrag(id);

	const handleDragStart = () => bringToFront(id);
	const handleDock = (side: SideZoneSide) => dockPanel(id, side);
	const handleUndock = () => undockPanel(id, position ?? clampPosition({ x: 0, y: 0 }, PANEL_DEFAULT_WIDTH));

	if (dockedSide) {
		return (
			<DockedPanelView
				title={title}
				zIndex={zIndex}
				drag={drag}
				onDragStart={handleDragStart}
				onClose={onClose}
				onUndock={handleUndock}
			/>
		);
	}

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
