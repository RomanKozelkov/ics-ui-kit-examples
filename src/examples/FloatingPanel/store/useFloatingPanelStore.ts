import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Position } from "../types/FloatingPanelTypes";

type FloatingPanelPositionState = {
	position: Position | null;
	setPosition: (position: Position) => void;
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
};

export const useFloatingPanelStore = create<FloatingPanelPositionState>()(
	persist(
		(set) => ({
			position: null,
			setPosition: (position) => set({ position }),
			isOpen: false,
			setIsOpen: (isOpen) => set({ isOpen })
		}),
		{ name: "draggable-window-position" }
	)
);
