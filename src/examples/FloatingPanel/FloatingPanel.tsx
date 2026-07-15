import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { IconButton } from "ics-ui-kit/components/button";
import { History } from "lucide-react";
import { useRef, useState } from "react";
import { useFloatingPanelStore } from "./store/useFloatingPanelStore";
import { FloatingPanel } from "./components/FloatingPanel";

export const WINDOW_WIDTH = 320;
export const WINDOW_MAX_HEIGHT = 480;
export const WINDOW_GAP = 12;

export const FloatingPanelExample = () => {
	const position = useFloatingPanelStore((state) => state.position);
	const setPosition = useFloatingPanelStore((state) => state.setPosition);
	const [isOpen, setIsOpen] = useState(false);
	const toggleButtonRef = useRef<HTMLButtonElement>(null);

	const handleDragEnd = (event: DragEndEvent) => {
		if (!position) return;
		setPosition({
			x: position.x + event.delta.x,
			y: position.y + event.delta.y
		});
	};

	const handleToggle = () => {
		if (!isOpen && !position) {
			const buttonRect = toggleButtonRef.current?.getBoundingClientRect();
			if (buttonRect) {
				setPosition({
					x: buttonRect.right - WINDOW_WIDTH,
					y: buttonRect.top - WINDOW_MAX_HEIGHT - WINDOW_GAP
				});
			}
		}
		setIsOpen((prev) => !prev);
	};

	return (
		<div className="relative h-screen w-full overflow-hidden bg-alpha-80">
			<DndContext onDragEnd={handleDragEnd}>
				{isOpen && <FloatingPanel onClose={() => setIsOpen(false)} />}
			</DndContext>
			<IconButton
				ref={toggleButtonRef}
				className="absolute bottom-40 right-40"
				icon={History}
				variant="outline"
				onClick={handleToggle}
			/>
		</div>
	);
};
