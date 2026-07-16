import { useFloatingPanelStore } from "../store/useFloatingPanelStore";
import { PanelConfig } from "../types/FloatingPanelTypes";
import { Panel } from "./Panel";

export const PanelWindow = ({ id, title }: PanelConfig) => {
	const isOpen = useFloatingPanelStore((state) => state.panels[id].isOpen);
	const setIsOpen = useFloatingPanelStore((state) => state.setIsOpen);

	if (!isOpen) return null;

	return <Panel id={id} title={title} onClose={() => setIsOpen(id, false)} />;
};
