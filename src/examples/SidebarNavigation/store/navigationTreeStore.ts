import { create } from "zustand";
import { initialExpanded, initialItems, initialSelected, Item } from "../data/navigationData";
import { buildParentMap } from "../utils/sidebarInsertionLineUtils";

type NavigationTreeStore = {
	items: Record<string, Item>;
	parentMap: Record<string, string>;
	expanded: ReadonlySet<string>;
	selectedId: string;
	editingId: string | null;
	editingParentId: string | null;
	toggleExpanded: (id: string, open: boolean) => void;
	select: (id: string) => void;
	insertAfter: (afterId: string, afterDepth: number, targetDepth: number) => void;
	commitRename: (id: string, name: string) => void;
	cancelRename: () => void;
};

export const useNavigationTreeStore = create<NavigationTreeStore>((set) => ({
	items: initialItems,
	parentMap: buildParentMap(initialItems),
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

	insertAfter: (afterId, afterDepth, targetDepth) =>
		set((state) => {
			const newId = crypto.randomUUID();
			let parentId: string;
			let anchorId: string | null;

			if (targetDepth > afterDepth) {
				parentId = afterId;
				anchorId = null;
			} else {
				let curId = afterId;
				let curDepth = afterDepth;
				while (curDepth > targetDepth) {
					const pid = state.parentMap[curId];
					if (!pid) break;
					curId = pid;
					curDepth--;
				}
				const pid = state.parentMap[curId];
				if (!pid) return {};
				parentId = pid;
				anchorId = curId;
			}

			const parent = state.items[parentId];
			if (!parent) return {};

			const siblings = parent.children ?? [];
			const nextSiblings =
				anchorId === null
					? [newId, ...siblings]
					: (() => {
							const idx = siblings.indexOf(anchorId);
							return [...siblings.slice(0, idx + 1), newId, ...siblings.slice(idx + 1)];
						})();

			const nextItems = {
				...state.items,
				[parentId]: { ...parent, children: nextSiblings },
				[newId]: { name: "" }
			};

			return {
				items: nextItems,
				parentMap: buildParentMap(nextItems),
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
			const nextItems = {
				...rest,
				[editingParentId]: { ...parent, children: parent.children?.filter((c) => c !== editingId) }
			};
			return {
				items: nextItems,
				parentMap: buildParentMap(nextItems),
				editingId: null,
				editingParentId: null
			};
		})
}));
