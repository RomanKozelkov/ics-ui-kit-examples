import { useRef } from "react";
import { useFloatingPanelStore } from "../store/useFloatingPanelStore";
import { clampPosition } from "../utils/clampPosition";
import { PANEL_GAP, PANEL_DEFAULT_HEIGHT, PANEL_DEFAULT_WIDTH } from "../constants";
import { TriggerButton } from "ics-ui-kit/components/button";
import { PanelConfig } from "../types/FloatingPanelTypes";

export const PanelToggleButton = ({ id, icon }: PanelConfig) => {
	const isOpen = useFloatingPanelStore((state) => state.panels[id].isOpen);
	const position = useFloatingPanelStore((state) => state.panels[id].position);
	const setPosition = useFloatingPanelStore((state) => state.setPosition);
	const setIsOpen = useFloatingPanelStore((state) => state.setIsOpen);
	const buttonRef = useRef<HTMLButtonElement>(null);

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

	return (
		<TriggerButton
			ref={buttonRef}
			startIcon={icon}
			variant="outline"
			data-state={isOpen ? "open" : "closed"}
			onClick={handleToggle}
		/>
	);
};
