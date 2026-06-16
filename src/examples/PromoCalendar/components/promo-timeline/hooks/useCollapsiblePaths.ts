import { useCallback, useState } from "react";

/** Набор свёрнутых групп по path + переключение одного path. */
export function useCollapsiblePaths(): {
	collapsedPaths: Set<string>;
	onToggle: (path: string) => void;
} {
	const [collapsedPaths, setCollapsedPaths] = useState<Set<string>>(() => new Set());

	const onToggle = useCallback((path: string) => {
		setCollapsedPaths((prev) => {
			const next = new Set(prev);
			if (next.has(path)) next.delete(path);
			else next.add(path);
			return next;
		});
	}, []);

	return { collapsedPaths, onToggle };
}
