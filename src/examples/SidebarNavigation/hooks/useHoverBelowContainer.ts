import { useEffect, useState } from "react";
import type { RefObject } from "react";
import { AFTER_CONTAINER_HOVER_OFFSET_PX } from "../utils/constants";

export function useHoverBelowContainer(containerRef: RefObject<HTMLDivElement | null>) {
	const [isHoverBelow, setIsHoverBelow] = useState(false);

	useEffect(() => {
		const onPointerMove = (e: PointerEvent) => {
			const rect = containerRef.current?.getBoundingClientRect();
			if (!rect) return;
			setIsHoverBelow(e.clientY > rect.bottom + AFTER_CONTAINER_HOVER_OFFSET_PX && e.clientX >= rect.left && e.clientX <= rect.right);
		};
		window.addEventListener("pointermove", onPointerMove);
		return () => window.removeEventListener("pointermove", onPointerMove);
	}, []);

	return { isHoverBelow };
}
