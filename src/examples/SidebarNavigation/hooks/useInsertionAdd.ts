import { useNavigationTreeStore } from "../store/navigationTreeStore";

export function useInsertionAdd(id: string, getParentId: (depth: number) => string | null) {
	return (targetDepth: number) => {
		const { items } = useNavigationTreeStore.getState();
		const parentId = getParentId(targetDepth);
		const parentName = parentId ? items[parentId]?.name : undefined;
		const itemName = items[id]?.name;
		console.log(`Вставить в "${parentName}" после "${itemName}"`);
	};
}
