import { useFloatingPanelStore } from "../store/useFloatingPanelStore";
import { PanelConfig } from "../types/FloatingPanelTypes";
import { Panel } from "./panel/Panel";

export const PanelWindow = ({ id, title }: PanelConfig) => {
	const isOpen = useFloatingPanelStore((state) => state.panels[id].isOpen);
	const dockedIn = useFloatingPanelStore((state) => state.panels[id].dockedIn);
	const setIsOpen = useFloatingPanelStore((state) => state.setIsOpen);

	if (!isOpen || dockedIn) return null;

	return <Panel id={id} title={title} onClose={() => setIsOpen(id, false)} />;
};
