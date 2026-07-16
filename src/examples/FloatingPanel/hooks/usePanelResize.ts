import { useCallback } from "react";
import { Resizable } from "re-resizable";
import { useFloatingPanelStore } from "../store/useFloatingPanelStore";
import { PanelId } from "../types/FloatingPanelTypes";

export const usePanelResize = (id: PanelId, setDragNodeRef: (node: HTMLElement | null) => void) => {
	const size = useFloatingPanelStore((state) => state.panels[id].size);
	const setSize = useFloatingPanelStore((state) => state.setSize);

	const resizableRef = useCallback(
		(resizable: Resizable | null) => setDragNodeRef(resizable?.resizable ?? null),
		[setDragNodeRef]
	);

	const handleResizeStop = useCallback(
		(_event: unknown, _direction: unknown, _ref: unknown, delta: { width: number; height: number }) => {
			setSize(id, { width: size.width + delta.width, height: size.height + delta.height });
		},
		[id, setSize, size.height, size.width]
	);

	return { size, resizableRef, handleResizeStop };
};
