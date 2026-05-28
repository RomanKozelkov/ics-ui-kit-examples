import * as React from "react";

/**
 * Определяет, принадлежит ли портальный элемент (radix dropdown, tooltip) сайдбару.
 *
 * Radix-порталы рендерятся в body, а не внутри сайдбара, поэтому sidebarEl.contains(target)
 * для них возвращает false. Но radix связывает портал с триггером через aria-атрибуты:
 * - Dropdown: триггер[aria-controls] -> контент[id]
 * - Tooltip: триггер[aria-describedby] -> контент[id]
 *
 * Стратегия: если target внутри radix-popper, находим id контента, ищем триггер
 * по aria-атрибуту с этим id, и проверяем что триггер внутри сайдбара.
 *
 * Дополнительно: dropdown ставит body { pointer-events: none } + data-state="open"
 * на триггере — используем как fallback, когда aria-связь не найдена.
 */
const isPortalOwnedBySidebar = (target: Node, sidebarEl: HTMLElement): boolean => {
	// Dropdown ставит body { pointer-events: none }, target становится <html>.
	// Проверяем data-state="open" на триггере внутри сайдбара.
	if (document.body.style.pointerEvents === "none") {
		return sidebarEl.querySelector('[data-state="open"][aria-haspopup]') !== null;
	}

	// Tooltip и другие порталы без pointer-events: none.
	// Target внутри radix-popper — ищем aria-связь с триггером в сайдбаре.
	if (target instanceof HTMLElement) {
		const popperWrapper = target.closest("[data-radix-popper-content-wrapper]");
		if (popperWrapper) {
			const contentWithId = popperWrapper.querySelector("[id]");
			if (contentWithId) {
				const contentId = contentWithId.id;
				const trigger =
					sidebarEl.querySelector(`[aria-describedby="${contentId}"]`) ??
					sidebarEl.querySelector(`[aria-controls="${contentId}"]`);
				if (trigger) return true;
			}
		}
	}

	return false;
};

export const SIDEBAR_TRIGGER_ATTR = "data-sidebar-trigger";

export const useSidebarFloating = (ref: React.RefObject<HTMLDivElement>, isFloatingMode: boolean) => {
	const [isSidebarFloating, setIsSidebarFloating] = React.useState(false);

	const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
	const isOverRef = React.useRef(false);

	const clearTimer = React.useCallback(() => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}
	}, []);

	React.useEffect(() => {
		if (!isFloatingMode) return;

		const handleMouseOver = (event: MouseEvent) => {
			const sidebarEl = ref.current;
			if (!sidebarEl) return;

			const target = event.target as Node;
			const isOverSidebar =
				sidebarEl.contains(target) ||
				(target instanceof Element && target.closest(`[${SIDEBAR_TRIGGER_ATTR}]`) !== null) ||
				isPortalOwnedBySidebar(target, sidebarEl);

			if (isOverSidebar === isOverRef.current) return;
			isOverRef.current = isOverSidebar;

			if (isOverSidebar) {
				clearTimer();
				setIsSidebarFloating(true);
			} else {
				timerRef.current = setTimeout(() => {
					setIsSidebarFloating(false);
					timerRef.current = null;
				}, 300);
			}
		};

		document.addEventListener("mouseover", handleMouseOver);

		return () => {
			document.removeEventListener("mouseover", handleMouseOver);
			clearTimer();
			isOverRef.current = false;
		};
	}, [isFloatingMode, ref, setIsSidebarFloating, clearTimer]);

	React.useEffect(() => {
		if (!isFloatingMode) {
			clearTimer();
			setIsSidebarFloating(false);
		}
	}, [isFloatingMode, clearTimer, setIsSidebarFloating]);

	return {
		isSidebarFloating
	};
};
