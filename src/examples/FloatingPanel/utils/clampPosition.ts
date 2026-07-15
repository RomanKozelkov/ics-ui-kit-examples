import { HEADER_HEIGHT } from "../constants";
import { Position } from "../types/FloatingPanelTypes";

const MIN_VISIBLE = 40;

export const clampPosition = (position: Position, panelWidth: number): Position => {
	const viewport = { width: window.innerWidth, height: window.innerHeight };
	const minVisible = Math.min(MIN_VISIBLE, panelWidth);

	const x = Math.min(Math.max(position.x, minVisible - panelWidth), viewport.width - minVisible);
	const y = Math.min(Math.max(position.y, 0), viewport.height - HEADER_HEIGHT);

	return { x, y };
};
