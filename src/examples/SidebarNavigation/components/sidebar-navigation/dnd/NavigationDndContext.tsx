import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import type { DragEndEvent, DragMoveEvent, DragStartEvent } from "@dnd-kit/core";
import { useRef, useState, useEffect, type ReactNode } from "react";
import { DndStateProvider } from "./DndStateContext";
import { DraggedItemPreview } from "./DraggedItemPreview";
import type { DropZone } from "../../../types/DndTypes";
import { getDropPosition } from "../../../utils/getDropPosition";
import { isDescendant } from "../../../utils/isDescendant";
import { useNavigationTreeStore } from "../../../store/navigationTreeStore";

export function NavigationDndContext({ children }: { children: ReactNode }) {
	const [activeId, setActiveId] = useState<string | null>(null);
	const [dropZone, setDropZone] = useState<DropZone>(null);
	const items = useNavigationTreeStore((s) => s.items);
	const setDragging = useNavigationTreeStore((s) => s.setDragging);
	const pointerYRef = useRef<number>(0);

	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

	useEffect(() => {
		const handler = (e: PointerEvent) => {
			pointerYRef.current = e.clientY;
		};
		document.addEventListener("pointermove", handler);
		return () => document.removeEventListener("pointermove", handler);
	}, []);

	const handleDragStart = ({ active }: DragStartEvent) => {
		setActiveId(String(active.id));
		setDragging(true);
	};

	const handleDragMove = ({ active, over }: DragMoveEvent) => {
		if (!over) {
			setDropZone(null);
			return;
		}
		const targetId = String(over.id);
		const dragId = String(active.id);

		if (targetId === dragId || isDescendant(items, dragId, targetId)) {
			setDropZone(null);
			return;
		}

		const rect = over.rect;
		const position = getDropPosition(pointerYRef.current, rect.top, rect.height);
		setDropZone({ targetId, position });
	};

	const handleDragEnd = ({ active, over }: DragEndEvent) => {
		if (over && dropZone) {
			const dragId = String(active.id);
			const { targetId, position } = dropZone;
			const dragName = items[dragId]?.name ?? dragId;
			const targetName = items[targetId]?.name ?? targetId;

			if (position === "child") {
				console.log(`Drop: "${dragName}" → дочерний элемент "${targetName}"`);
			} else {
				console.log(`Drop: "${dragName}" → ${position === "before" ? "перед" : "после"} "${targetName}"`);
			}
		}

		setActiveId(null);
		setDropZone(null);
		setDragging(false);
	};

	const handleDragCancel = () => {
		setActiveId(null);
		setDropZone(null);
		setDragging(false);
	};

	const activeItem = activeId ? items[activeId] : null;

	return (
		<DndContext
			sensors={sensors}
			onDragStart={handleDragStart}
			onDragMove={handleDragMove}
			onDragEnd={handleDragEnd}
			onDragCancel={handleDragCancel}
		>
			<DndStateProvider value={{ activeId, dropZone }}>{children}</DndStateProvider>
			<DragOverlay>{activeItem && <DraggedItemPreview data={activeItem} />}</DragOverlay>
		</DndContext>
	);
}
