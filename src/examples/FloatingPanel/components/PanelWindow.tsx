import { useFloatingPanelStore } from "../store/useFloatingPanelStore";
import { PanelConfig } from "../types/FloatingPanelTypes";
import { FloatingPanel } from "./FloatingPanel";

export const PanelWindow = ({ id, title, icon }: PanelConfig) => {
	const isOpen = useFloatingPanelStore((state) => state.panels[id].isOpen);
	const setIsOpen = useFloatingPanelStore((state) => state.setIsOpen);

	if (!isOpen) return null;

	return <FloatingPanel id={id} title={title} icon={icon} onClose={() => setIsOpen(id, false)} />;
};
