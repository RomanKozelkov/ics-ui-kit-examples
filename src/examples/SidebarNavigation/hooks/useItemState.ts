import { useNavigationTreeStore } from "../store/navigationTreeStore";

export function useItemState(id: string) {
	const data = useNavigationTreeStore((s) => s.items[id]);
	const open = useNavigationTreeStore((s) => s.expanded.has(id));
	const isSelected = useNavigationTreeStore((s) => s.selectedId === id);
	const toggleExpanded = useNavigationTreeStore((s) => s.toggleExpanded);
	const select = useNavigationTreeStore((s) => s.select);

	return { data, open, isSelected, toggleExpanded, select };
}
