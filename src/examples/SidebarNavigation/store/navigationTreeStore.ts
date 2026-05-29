import { create } from "zustand";
import { initialExpanded, initialItems, initialSelected, Item } from "../data/navigationData";

type NavigationTreeStore = {
	items: Record<string, Item>;
	expanded: ReadonlySet<string>;
	selectedId: string;
	isDragging: boolean;
	toggleExpanded: (id: string, open: boolean) => void;
	select: (id: string) => void;
	setDragging: (v: boolean) => void;
};

export const useNavigationTreeStore = create<NavigationTreeStore>((set) => ({
	items: initialItems,
	expanded: new Set(initialExpanded),
	selectedId: initialSelected[0] ?? "",
	isDragging: false,

	setDragging: (v) => set({ isDragging: v }),

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
		})
}));
