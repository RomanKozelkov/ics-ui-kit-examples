import { DraggableAttributes, useDraggable } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { Transform } from "@dnd-kit/utilities";
import { PanelId } from "../types/FloatingPanelTypes";

export type PanelDragState = {
	attributes: DraggableAttributes;
	listeners: SyntheticListenerMap | undefined;
	setNodeRef: (node: HTMLElement | null) => void;
	transform: Transform | null;
	transition: string | undefined;
	isDragging: boolean;
	dockedDragRect: { left: number; top: number; width: number; height: number } | null | undefined;
};

export const useFloatingPanelDrag = (id: PanelId): PanelDragState => {
	const { attributes, listeners, setNodeRef, transform, isDragging, active } = useDraggable({ id });
	const dockedDragRect = isDragging ? active?.rect.current.initial : null;

	return { attributes, listeners, setNodeRef, transform, transition: undefined, isDragging, dockedDragRect };
};

export const useDockedPanelDrag = (id: PanelId): PanelDragState => {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging, active } = useSortable({ id });
	const dockedDragRect = isDragging ? active?.rect.current.initial : null;

	return { attributes, listeners, setNodeRef, transform, transition, isDragging, dockedDragRect };
};
