import { useState } from "react";
import { useDndMonitor } from "@dnd-kit/core";
import { getEdgeDropSide } from "../utils/getEdgeDropSide";
import { SideZoneSide } from "../types/FloatingPanelTypes";

export const useActiveDropSide = (): SideZoneSide | null => {
	const [dropSide, setDropSide] = useState<SideZoneSide | null>(null);

	useDndMonitor({
		onDragMove: ({ active }) => {
			const rect = active.rect.current.translated;
			setDropSide(rect ? getEdgeDropSide(rect, window.innerWidth) : null);
		},
		onDragEnd: () => setDropSide(null),
		onDragCancel: () => setDropSide(null)
	});

	return dropSide;
};
