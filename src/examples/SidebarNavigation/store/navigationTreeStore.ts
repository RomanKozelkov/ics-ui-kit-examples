import { create } from "zustand";
import { initialExpanded, initialItems, initialSelected, Item } from "../data/navigationData";

export type DragTarget = {
	anchorId: string;
	parentId: string | null;
	depth: number;
	mode: "after" | "into";
} | null;

type NavigationTreeStore = {
	items: Record<string, Item>;
	expanded: ReadonlySet<string>;
	selectedId: string;
	hoveredParentId: string | null;
	hoveredAnchorId: string | null;
	draggingId: string | null;
	dragTarget: DragTarget;
	toggleExpanded: (id: string, open: boolean) => void;
	select: (id: string) => void;
	setHover: (parentId: string | null, anchorId: string | null) => void;
	setDragging: (id: string | null) => void;
	setDragTarget: (target: DragTarget) => void;
};

export const useNavigationTreeStore = create<NavigationTreeStore>((set) => ({
	items: initialItems,
	expanded: new Set(initialExpanded),
	selectedId: initialSelected[0] ?? "",
	hoveredParentId: null,
	hoveredAnchorId: null,
	draggingId: null,
	dragTarget: null,

	toggleExpanded: (id, open) =>
		set((state) => {
			const next = new Set(state.expanded);
			if (open) next.add(id);
			else next.delete(id);
			return { expanded: next };
		}),

	select: (id) =>
		set((state) => {
			const next = new Set(state.expanded);
			next.add(id);
			return { selectedId: id, expanded: next };
		}),

	setHover: (parentId, anchorId) => set({ hoveredParentId: parentId, hoveredAnchorId: anchorId }),

	setDragging: (id) => set({ draggingId: id, dragTarget: null }),

	setDragTarget: (target) => set({ dragTarget: target })
}));
