import { useRef } from "react";
import { GlassToolbarIcon, GlassToolbarToggleItem } from "ics-ui-kit/components/glass-toolbar";
import { PanelConfig } from "../types/FloatingPanelTypes";
import { usePanelToggle } from "../hooks/usePanelToggle";

export const PanelToggleButton = ({ id, icon }: PanelConfig) => {
	const buttonRef = useRef<HTMLButtonElement>(null);
	const { handleToggle } = usePanelToggle(id, buttonRef);

	return (
		<GlassToolbarToggleItem ref={buttonRef} value={id} onClick={handleToggle}>
			{icon && <GlassToolbarIcon icon={icon} />}
		</GlassToolbarToggleItem>
	);
};
