import { PanelId } from "../../types/FloatingPanelTypes";
import { useFloatingPanelStore } from "../../store/useFloatingPanelStore";
import { DockedPanel } from "./docked-panel/DockedPanel";
import { FloatingPanel } from "./floating-panel/FloatingPanel";

export type PanelProps = {
	id: PanelId;
	title: string;
	onClose: () => void;
};

export const Panel = ({ id, title, onClose }: PanelProps) => {
	const dockedSide = useFloatingPanelStore((state) => state.panels[id].dockedSide);

	if (dockedSide) {
		return <DockedPanel id={id} title={title} onClose={onClose} />;
	}

	return <FloatingPanel id={id} title={title} onClose={onClose} />;
};
