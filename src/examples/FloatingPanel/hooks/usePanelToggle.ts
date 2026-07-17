import { RefObject } from "react";
import { useFloatingPanelStore } from "../store/useFloatingPanelStore";
import { clampPosition } from "../utils/clampPosition";
import { PANEL_GAP, PANEL_DEFAULT_HEIGHT, PANEL_DEFAULT_WIDTH } from "../constants";
import { PanelId } from "../types/FloatingPanelTypes";

export const usePanelToggle = (id: PanelId, buttonRef: RefObject<HTMLButtonElement | null>) => {
	const isOpen = useFloatingPanelStore((state) => state.panels[id].isOpen);
	const position = useFloatingPanelStore((state) => state.panels[id].position);
	const setPosition = useFloatingPanelStore((state) => state.setPosition);
	const setIsOpen = useFloatingPanelStore((state) => state.setIsOpen);

	const handleToggle = () => {
		if (!isOpen && !position) {
			const buttonRect = buttonRef.current?.getBoundingClientRect();
			if (buttonRect) {
				setPosition(
					id,
					clampPosition(
						{
							x: buttonRect.right - PANEL_DEFAULT_WIDTH,
							y: buttonRect.top - PANEL_DEFAULT_HEIGHT - PANEL_GAP
						},
						PANEL_DEFAULT_WIDTH
					)
				);
			}
		}
		setIsOpen(id, !isOpen);
	};

	return { handleToggle };
};
