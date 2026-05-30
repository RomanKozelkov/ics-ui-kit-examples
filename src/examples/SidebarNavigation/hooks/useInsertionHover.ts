import { useNavigationTreeStore } from "../store/navigationTreeStore";

export function useInsertionHover(getParentId: (depth: number) => string | null) {
	const setHover = useNavigationTreeStore((s) => s.setHover);
	return (depth: number | null) => {
		if (depth === null) setHover(null, null);
		else setHover(getParentId(depth), getParentId(depth + 1));
	};
}
