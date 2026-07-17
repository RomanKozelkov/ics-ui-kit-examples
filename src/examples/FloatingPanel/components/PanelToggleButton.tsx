import { useRef } from "react";
import { TriggerButton } from "ics-ui-kit/components/button";
import { PanelConfig } from "../types/FloatingPanelTypes";
import { usePanelToggle } from "../hooks/usePanelToggle";

export const PanelToggleButton = ({ id, icon }: PanelConfig) => {
	const buttonRef = useRef<HTMLButtonElement>(null);
	const { isOpen, handleToggle } = usePanelToggle(id, buttonRef);

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
