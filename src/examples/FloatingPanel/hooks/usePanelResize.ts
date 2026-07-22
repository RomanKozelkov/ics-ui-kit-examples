import { useCallback, useEffect, useRef, useState } from "react";
import { Resizable, type NumberSize, type ResizeDirection } from "re-resizable";
import { useFloatingPanelStore } from "../store/useFloatingPanelStore";
import { PanelId, Position } from "../types/FloatingPanelTypes";
import { clampPosition } from "../utils/clampPosition";

export const usePanelResize = (
	id: PanelId,
	position: Position | null,
	setDragNodeRef: (node: HTMLElement | null) => void
) => {
	const size = useFloatingPanelStore((state) => state.panels[id].size);
	const setSizeAndPosition = useFloatingPanelStore((state) => state.setSizeAndPosition);

	const [livePosition, setLivePosition] = useState(position);
	const [isResizing, setIsResizing] = useState(false);
	const resizeStartPositionRef = useRef(position);

	useEffect(() => {
		setLivePosition(position);
	}, [position]);

	const resizableRef = useCallback(
		(resizable: Resizable | null) => setDragNodeRef(resizable?.resizable ?? null),
		[setDragNodeRef]
	);

	const getAdjustedPosition = useCallback(
		(direction: ResizeDirection, delta: NumberSize): Position | null => {
			const start = resizeStartPositionRef.current;
			if (!start) return null;
			const dir = direction.toLowerCase();
			const nextPosition = {
				x: dir.includes("left") ? start.x - delta.width : start.x,
				y: dir.includes("top") ? start.y - delta.height : start.y
			};
			return clampPosition(nextPosition, size.width + delta.width);
		},
		[size.width]
	);

	const handleResizeStart = useCallback(() => {
		resizeStartPositionRef.current = livePosition;
		setIsResizing(true);
	}, [livePosition]);

	const handleResize = useCallback(
		(_event: unknown, direction: ResizeDirection, _ref: unknown, delta: NumberSize) => {
			const adjustedPosition = getAdjustedPosition(direction, delta);
			if (adjustedPosition) setLivePosition(adjustedPosition);
		},
		[getAdjustedPosition]
	);

	const handleResizeStop = useCallback(
		(_event: unknown, direction: ResizeDirection, _ref: unknown, delta: NumberSize) => {
			const adjustedPosition = getAdjustedPosition(direction, delta);
			setIsResizing(false);
			if (!adjustedPosition) return;
			setSizeAndPosition(id, { width: size.width + delta.width, height: size.height + delta.height }, adjustedPosition);
		},
		[id, setSizeAndPosition, size.height, size.width, getAdjustedPosition]
	);

	return { size, livePosition, isResizing, resizableRef, handleResizeStart, handleResize, handleResizeStop };
};
