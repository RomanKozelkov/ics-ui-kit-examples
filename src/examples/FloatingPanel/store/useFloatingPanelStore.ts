import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PanelId, Position } from "../types/FloatingPanelTypes";

type PanelState = {
	position: Position | null;
	isOpen: boolean;
};

type FloatingPanelState = {
	panels: Record<PanelId, PanelState>;
	setPosition: (id: PanelId, position: Position) => void;
	setIsOpen: (id: PanelId, isOpen: boolean) => void;
};

const createPanelState = (): PanelState => ({ position: null, isOpen: false });

export const useFloatingPanelStore = create<FloatingPanelState>()(
	persist(
		(set) => ({
			panels: {
				history: createPanelState(),
				notifications: createPanelState(),
				comments: createPanelState()
			},
			setPosition: (id, position) =>
				set((state) => ({
					panels: { ...state.panels, [id]: { ...state.panels[id], position } }
				})),
			setIsOpen: (id, isOpen) =>
				set((state) => ({
					panels: { ...state.panels, [id]: { ...state.panels[id], isOpen } }
				}))
		}),
		{ name: "draggable-window-position" }
	)
);
