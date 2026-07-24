import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PANEL_DEFAULT_HEIGHT, PANEL_DEFAULT_WIDTH, SIDE_ZONE_DEFAULT_WIDTH } from "../constants";
import { PanelId, Position, SideZoneSide, Size } from "../types/FloatingPanelTypes";
import { clampPosition } from "../utils/clampPosition";

const INITIAL_Z_INDEX = 10;

type PanelState = {
	position: Position | null;
	size: Size;
	isOpen: boolean;
	zIndex: number;
	dockedSide: SideZoneSide | null;
	isMaximized: boolean;
};

type FloatingPanelState = {
	panels: Record<PanelId, PanelState>;
	nextZIndex: number;
	sideZoneWidths: Record<SideZoneSide, number>;
	isResizingDockedPanels: boolean;
	setPosition: (id: PanelId, position: Position) => void;
	setSizeAndPosition: (id: PanelId, size: Size, position: Position) => void;
	setIsOpen: (id: PanelId, isOpen: boolean) => void;
	bringToFront: (id: PanelId) => void;
	setSideZoneWidth: (side: SideZoneSide, width: number) => void;
	dockPanel: (id: PanelId, side: SideZoneSide) => void;
	undockPanel: (id: PanelId, position: Position) => void;
	setIsResizingDockedPanels: (isResizing: boolean) => void;
	maximizePanel: (id: PanelId) => void;
	restorePanel: (id: PanelId) => void;
};

const createPanelState = (): PanelState => ({
	position: null,
	size: { width: PANEL_DEFAULT_WIDTH, height: PANEL_DEFAULT_HEIGHT },
	isOpen: false,
	zIndex: INITIAL_Z_INDEX,
	dockedSide: null,
	isMaximized: false
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
			isResizingDockedPanels: false,
			setPosition: (id, position) =>
				set((state) => ({
					panels: { ...state.panels, [id]: { ...state.panels[id], position } }
				})),
			setSizeAndPosition: (id, size, position) =>
				set((state) => ({
					panels: { ...state.panels, [id]: { ...state.panels[id], size, position } }
				})),
			setIsOpen: (id, isOpen) =>
				set((state) => {
					const panel = state.panels[id];
					const position =
						isOpen && !panel.position && !panel.dockedSide
							? clampPosition({ x: 0, y: 0 }, panel.size.width)
							: panel.position;
					return {
						panels: { ...state.panels, [id]: { ...panel, isOpen, position } }
					};
				}),
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
				})),
			setIsResizingDockedPanels: (isResizing) => set({ isResizingDockedPanels: isResizing }),
			maximizePanel: (id) =>
				set((state) => ({
					panels: { ...state.panels, [id]: { ...state.panels[id], isMaximized: true } }
				})),
			restorePanel: (id) =>
				set((state) => ({
					panels: { ...state.panels, [id]: { ...state.panels[id], isMaximized: false } }
				}))
		}),
		{
			name: "floating-panel-state",
			partialize: (state) => ({
				panels: state.panels,
				nextZIndex: state.nextZIndex,
				sideZoneWidths: state.sideZoneWidths
			})
		}
	)
);
