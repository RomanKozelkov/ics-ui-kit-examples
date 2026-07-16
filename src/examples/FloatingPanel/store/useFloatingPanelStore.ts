import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PANEL_DEFAULT_HEIGHT, PANEL_DEFAULT_WIDTH, SIDE_ZONE_DEFAULT_WIDTH } from "../constants";
import { PanelId, Position, SideZoneSide, Size } from "../types/FloatingPanelTypes";

const INITIAL_Z_INDEX = 10;

type PanelState = {
	position: Position | null;
	size: Size;
	isOpen: boolean;
	zIndex: number;
	dockedSide: SideZoneSide | null;
};

type FloatingPanelState = {
	panels: Record<PanelId, PanelState>;
	nextZIndex: number;
	sideZoneWidths: Record<SideZoneSide, number>;
	setPosition: (id: PanelId, position: Position) => void;
	setSizeAndPosition: (id: PanelId, size: Size, position: Position) => void;
	setIsOpen: (id: PanelId, isOpen: boolean) => void;
	bringToFront: (id: PanelId) => void;
	setSideZoneWidth: (side: SideZoneSide, width: number) => void;
	dockPanel: (id: PanelId, side: SideZoneSide) => void;
	undockPanel: (id: PanelId, position: Position) => void;
};

const createPanelState = (): PanelState => ({
	position: null,
	size: { width: PANEL_DEFAULT_WIDTH, height: PANEL_DEFAULT_HEIGHT },
	isOpen: true,
	zIndex: INITIAL_Z_INDEX,
	dockedSide: null
});

export const useFloatingPanelStore = create<FloatingPanelState>()(
	persist(
		(set) => ({
			panels: {
				history: createPanelState(),
				notifications: createPanelState(),
				comments: createPanelState()
			},
			nextZIndex: INITIAL_Z_INDEX + 1,
			sideZoneWidths: { left: SIDE_ZONE_DEFAULT_WIDTH, right: SIDE_ZONE_DEFAULT_WIDTH },
			setPosition: (id, position) =>
				set((state) => ({
					panels: { ...state.panels, [id]: { ...state.panels[id], position } }
				})),
			setSizeAndPosition: (id, size, position) =>
				set((state) => ({
					panels: { ...state.panels, [id]: { ...state.panels[id], size, position } }
				})),
			setIsOpen: (id, isOpen) =>
				set((state) => ({
					panels: { ...state.panels, [id]: { ...state.panels[id], isOpen } }
				})),
			bringToFront: (id) =>
				set((state) => ({
					panels: { ...state.panels, [id]: { ...state.panels[id], zIndex: state.nextZIndex } },
					nextZIndex: state.nextZIndex + 1
				})),
			setSideZoneWidth: (side, width) =>
				set((state) => ({
					sideZoneWidths: { ...state.sideZoneWidths, [side]: width }
				})),
			dockPanel: (id, side) =>
				set((state) => ({
					panels: { ...state.panels, [id]: { ...state.panels[id], dockedSide: side } }
				})),
			undockPanel: (id, position) =>
				set((state) => ({
					panels: { ...state.panels, [id]: { ...state.panels[id], dockedSide: null, position } }
				}))
		}),
		{ name: "draggable-window-position" }
	)
);
