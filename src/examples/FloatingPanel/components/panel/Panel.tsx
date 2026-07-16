import { PanelId } from "../../types/FloatingPanelTypes";
import { useFloatingPanelStore } from "../../store/useFloatingPanelStore";
import { usePanelDrag } from "../../hooks/usePanelDrag";
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
	const drag = usePanelDrag(id);

	const handleDragStart = () => bringToFront(id);

	if (dockedSide) {
		return (
			<DockedPanelView
				title={title}
				zIndex={zIndex}
				drag={drag}
				onDragStart={handleDragStart}
				onClose={onClose}
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
		/>
	);
};
