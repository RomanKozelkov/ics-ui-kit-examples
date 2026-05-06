import { create } from "zustand";
import type { Item } from "./navigationData";
import { initialExpanded, initialItems, initialSelected } from "./navigationData";

type NavigationTreeStore = {
	items: Record<string, Item>;
	expanded: ReadonlySet<string>;
	selectedId: string;
	toggleExpanded: (id: string, open: boolean) => void;
	select: (id: string) => void;
};

export const useNavigationTreeStore = create<NavigationTreeStore>((set) => ({
	items: initialItems,
	expanded: new Set(initialExpanded),
	selectedId: initialSelected[0] ?? "",
	toggleExpanded: (id, open) =>
		set((state) => {
			const next = new Set(state.expanded);
			if (open) {
				next.add(id);
			} else {
				next.delete(id);
			}
			return { expanded: next };
		}),
	select: (id) => set({ selectedId: id })
}));
