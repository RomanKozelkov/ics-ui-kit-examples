import { PANEL_DEFAULT_WIDTH } from "../../../constants";
import { useDockedPanelDrag } from "../../../hooks/usePanelDrag";
import { useFloatingPanelStore } from "../../../store/useFloatingPanelStore";
import { clampPosition } from "../../../utils/clampPosition";
import { PanelProps } from "../Panel";
import { DockedPanelView } from "./DockedPanelView";

export const DockedPanel = ({ id, title, onClose }: PanelProps) => {
	const zIndex = useFloatingPanelStore((state) => state.panels[id].zIndex);
	const bringToFront = useFloatingPanelStore((state) => state.bringToFront);
	const undockPanel = useFloatingPanelStore((state) => state.undockPanel);
	const position = useFloatingPanelStore((state) => state.panels[id].position);
	const drag = useDockedPanelDrag(id);

	const handleDragStart = () => bringToFront(id);
	const handleUndock = () => undockPanel(id, position ?? clampPosition({ x: 0, y: 0 }, PANEL_DEFAULT_WIDTH));

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
};
