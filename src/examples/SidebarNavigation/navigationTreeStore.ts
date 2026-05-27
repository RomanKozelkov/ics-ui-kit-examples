import { create } from "zustand";
import type { Item } from "./navigationData";
import { initialExpanded, initialItems, initialSelected } from "./navigationData";

type NavigationTreeStore = {
	items: Record<string, Item>;
	expanded: ReadonlySet<string>;
	selectedId: string;
	editingId: string | null;
	editingParentId: string | null;
	toggleExpanded: (id: string, open: boolean) => void;
	select: (id: string) => void;
	addItem: (parentId: string) => void;
	commitRename: (id: string, name: string) => void;
	cancelRename: () => void;
};

export const useNavigationTreeStore = create<NavigationTreeStore>((set) => ({
	items: initialItems,
	expanded: new Set(initialExpanded),
	selectedId: initialSelected[0] ?? "",
	editingId: null,
	editingParentId: null,
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
	addItem: (parentId) =>
		set((state) => {
			const newId = crypto.randomUUID();
			const parent = state.items[parentId];
			if (!parent) return {};
			return {
				items: {
					...state.items,
					[parentId]: { ...parent, children: [newId, ...(parent.children ?? [])] },
					[newId]: { name: "" }
				},
				expanded: new Set([...state.expanded, parentId]),
				editingId: newId,
				editingParentId: parentId,
				selectedId: newId
			};
		}),
	commitRename: (id, name) =>
		set((state) => ({
			items: { ...state.items, [id]: { ...(state.items[id] ?? {}), name } },
			editingId: null,
			editingParentId: null
		})),
	cancelRename: () =>
		set((state) => {
			const { editingId, editingParentId } = state;
			if (!editingId || !editingParentId) return { editingId: null, editingParentId: null };

			const parent = state.items[editingParentId];
			const { [editingId]: _, ...rest } = state.items;
			return {
				items: {
					...rest,
					[editingParentId]: { ...parent, children: parent.children?.filter((c) => c !== editingId) }
				},
				editingId: null,
				editingParentId: null
			};
		})
}));
