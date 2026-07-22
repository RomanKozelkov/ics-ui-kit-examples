import { ClientRect } from "@dnd-kit/core";
import { SIDE_ZONE_DROP_THRESHOLD } from "../constants";
import { SideZoneSide } from "../types/FloatingPanelTypes";

export const getEdgeDropSide = (rect: ClientRect, viewportWidth: number): SideZoneSide | null => {
	if (rect.left <= SIDE_ZONE_DROP_THRESHOLD) return "left";
	if (viewportWidth - rect.right <= SIDE_ZONE_DROP_THRESHOLD) return "right";
	return null;
};
