import { useLayoutEffect, useRef, useState } from "react";

export type UseActionBarOverflowResult = {
	/** Сколько items помещается видимыми — остальные уходят в overflow-меню. */
	visibleCount: number;
	/** ref на весь ActionBar (заголовок + кнопки) — по его ширине считаем overflow. */
	containerRef: React.RefObject<HTMLDivElement | null>;
};

const ITEM_WIDTH = 32;
const OVERFLOW_TRIGGER_WIDTH = 32;
const GAP = 4;
/**
 * Минимум, который всегда резервируем под заголовок, чтобы кнопки сворачивались
 * в overflow раньше, чем текст заголовка обрежется до нечитаемых 2-3 символов.
 */
const TITLE_RESERVED_WIDTH = 280;

/**
 * Все кнопки ActionBar — IconButton одного размера, поэтому их ширина фиксирована
 * и считать её измерением DOM не нужно: делим доступную ширину контейнера
 * на ITEM_WIDTH, резервируя место под заголовок и под кнопку-троеточие.
 */
export function useActionBarOverflow(itemCount: number, hasTitle: boolean): UseActionBarOverflowResult {
	const containerRef = useRef<HTMLDivElement>(null);
	const [visibleCount, setVisibleCount] = useState(itemCount);

	useLayoutEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const recalc = () => {
			const titleReserve = hasTitle ? TITLE_RESERVED_WIDTH + GAP : 0;
			const forItems = container.clientWidth - titleReserve;
			const fullWidth = itemCount * (ITEM_WIDTH + GAP) - GAP;

			if (fullWidth <= forItems) {
				setVisibleCount(itemCount);
				return;
			}

			const available = forItems - OVERFLOW_TRIGGER_WIDTH - GAP;
			const count = Math.max(0, Math.floor((available + GAP) / (ITEM_WIDTH + GAP)));
			setVisibleCount(Math.min(count, itemCount));
		};

		recalc();
		const observer = new ResizeObserver(recalc);
		observer.observe(container);
		return () => observer.disconnect();
	}, [itemCount, hasTitle]);

	return { visibleCount, containerRef };
}
