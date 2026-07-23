import { useRef } from "react";
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useFloatingPanelDnd } from "./hooks/useFloatingPanelDnd";
import { FloatingPanelZones } from "./components/FloatingPanelZones";
import "./styles/theme.css";

export const FloatingPanel = () => {
	const middleColumnRef = useRef<HTMLDivElement>(null);
	const { handleDragStart, handleDragEnd } = useFloatingPanelDnd(middleColumnRef);
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: { distance: 5 }
		})
	);

	return (
		<div className="gramax relative flex h-screen w-full overflow-hidden">
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
			>
				<FloatingPanelZones middleColumnRef={middleColumnRef} />
			</DndContext>
		</div>
	);
};
