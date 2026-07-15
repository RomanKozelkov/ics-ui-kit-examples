import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { TriggerButton } from "ics-ui-kit/components/button";
import { History } from "lucide-react";
import { useRef } from "react";
import { useFloatingPanelStore } from "./store/useFloatingPanelStore";
import { FloatingPanel } from "./components/FloatingPanel";
import { clampPosition } from "./utils/clampPosition";
import { PANEL_GAP, PANEL_MAX_HEIGHT, PANEL_WIDTH } from "./constants";

export const FloatingPanelExample = () => {
	const position = useFloatingPanelStore((state) => state.position);
	const setPosition = useFloatingPanelStore((state) => state.setPosition);
	const isOpen = useFloatingPanelStore((state) => state.isOpen);
	const setIsOpen = useFloatingPanelStore((state) => state.setIsOpen);
	const toggleButtonRef = useRef<HTMLButtonElement>(null);

	const handleDragEnd = (event: DragEndEvent) => {
		if (!position) return;
		setPosition(clampPosition({ x: position.x + event.delta.x, y: position.y + event.delta.y }, PANEL_WIDTH));
	};

	const handleToggle = () => {
		if (!isOpen && !position) {
			const buttonRect = toggleButtonRef.current?.getBoundingClientRect();
			if (buttonRect) {
				setPosition({
					x: buttonRect.right - PANEL_WIDTH,
					y: buttonRect.top - PANEL_MAX_HEIGHT - PANEL_GAP
				});
			}
		}
		setIsOpen(!isOpen);
	};

	return (
		<div className="relative h-screen w-full overflow-hidden bg-alpha-80">
			<DndContext onDragEnd={handleDragEnd}>
				{isOpen && <FloatingPanel onClose={() => setIsOpen(false)} />}
			</DndContext>
			<TriggerButton
				ref={toggleButtonRef}
				className="absolute bottom-40 right-40"
				startIcon={History}
				variant="outline"
				data-state={isOpen ? "open" : "closed"}
				onClick={handleToggle}
			/>
		</div>
	);
};
