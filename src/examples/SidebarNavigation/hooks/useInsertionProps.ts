import { useNavigationTreeStore } from "../store/navigationTreeStore";
import { getParentMap } from "../utils/parentMap";

type InsertionProps = {
	minDepth: number;
	maxDepth: number;
	getParentId: (targetDepth: number) => string | null;
};

export function useInsertionProps(id: string, level: number, isOpenFolder: boolean): InsertionProps {
	const items = useNavigationTreeStore((s) => s.items);
	const parentMap = getParentMap(items);

	if (isOpenFolder) {
		return {
			minDepth: level + 1,
			maxDepth: level + 1,
			getParentId: () => id
		};
	}

	let minDepth = 1;
	let curId = id;
	let curLevel = level;
	while (curLevel > 1) {
		const pid = parentMap[curId];
		if (!pid) break;
		const siblings = items[pid]?.children ?? [];
		const isLast = siblings.at(-1) === curId;
		if (!isLast) {
			minDepth = curLevel;
			break;
		}
		curId = pid;
		curLevel--;
	}

	return {
		minDepth,
		maxDepth: level + 1,
		getParentId: (targetDepth) => {
			if (targetDepth > level) return id;
			let curId = id;
			let curDepth = level;
			while (curDepth > targetDepth) {
				const pid = parentMap[curId];
				if (!pid) break;
				curId = pid;
				curDepth--;
			}
			return parentMap[curId] ?? null;
		}
	};
}
