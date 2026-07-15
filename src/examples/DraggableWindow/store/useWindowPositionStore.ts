import { create } from "zustand";
import { persist } from "zustand/middleware";

type Position = {
	x: number;
	y: number;
};

type WindowPositionState = {
	position: Position | null;
	setPosition: (position: Position) => void;
};

export const useWindowPositionStore = create<WindowPositionState>()(
	persist(
		(set) => ({
			position: null,
			setPosition: (position) => set({ position })
		}),
		{ name: "draggable-window-position" }
	)
);
