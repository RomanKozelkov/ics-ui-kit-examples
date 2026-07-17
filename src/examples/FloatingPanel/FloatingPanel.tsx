import { useRef } from "react";
import { DndContext } from "@dnd-kit/core";
import { useFloatingPanelDnd } from "./hooks/useFloatingPanelDnd";
import { FloatingPanelZones } from "./components/FloatingPanelZones";

export const FloatingPanel = () => {
	const middleColumnRef = useRef<HTMLDivElement>(null);
	const { handleDragStart, handleDragEnd } = useFloatingPanelDnd(middleColumnRef);

	return (
		<div className="relative flex h-screen w-full overflow-hidden">
			<DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
				<FloatingPanelZones middleColumnRef={middleColumnRef} />
			</DndContext>
		</div>
	);
};
