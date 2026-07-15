import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Position } from "../types/FloatingPanelTypes";

type FloatingPanelPositionState = {
	position: Position | null;
	setPosition: (position: Position) => void;
};

export const useFloatingPanelStore = create<FloatingPanelPositionState>()(
	persist(
		(set) => ({
			position: null,
			setPosition: (position) => set({ position })
		}),
		{ name: "draggable-window-position" }
	)
);
