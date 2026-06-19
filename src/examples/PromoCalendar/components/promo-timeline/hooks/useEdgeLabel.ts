import { useTimelineContext } from "dnd-timeline";
import type { DragDirection, ResizeMoveEvent, ResizeStartEvent, Span } from "dnd-timeline";
import { type MouseEvent, type PointerEvent, type TouchEvent, useCallback, useRef } from "react";
import { useEdgeLabelStore } from "../store/edgeLabel.store";
import { EDGE_LABEL_CLEARANCE_PX } from "../utils/constants";
import { msToDayLabel } from "../utils/date";
import { edgeDay, edgeUnderCursor } from "../utils/edgeLabel";
import { useTimelineHeader } from "./useTimelineHeader";

/**
 * Плавающая подсказка с датой края промо (как в Notion) при hover/resize краёв бара.
 *
 * Вся логика фичи живёт здесь; PromoItem только разводит её по DOM. Координаты пишутся в
 * стор императивно (getState().show/hide) — без локального state, поэтому бар не ререндерится
 * во время жеста и не дерётся с императивным ресайзом dnd-timeline.
 *
 * Геометрия чипа меряется от живого DOM-узла бара (его ширину библиотека двигает императивно
 * при ресайзе) и от scrollport'а ([data-timeline-scrollport] из CalendarSurface) — чтобы
 * флипнуть чип под бар, когда над верхней строкой под шапкой нет места.
 */
export function useEdgeLabel(itemSpan: Span) {
	const { getSpanFromResizeEvent } = useTimelineContext();
	const { headerHeight } = useTimelineHeader();
	const nodeRef = useRef<HTMLDivElement | null>(null);
	// scrollport резолвится один раз при монтировании узла — не дёргаем closest() на каждый move.
	const scrollportRef = useRef<HTMLElement | null>(null);
	// Последний показанный чип: пропускаем повторный show() при том же содержимом (move шлёт его пиксельно).
	const lastKeyRef = useRef<string | null>(null);

	const pushLabel = useCallback(
		(side: DragDirection, dayMs: number) => {
			const node = nodeRef.current;
			if (!node) return;
			const rect = node.getBoundingClientRect();
			const topLimit = (scrollportRef.current?.getBoundingClientRect().top ?? 0) + headerHeight;
			// Нет места над баром (верхняя строка под шапкой) → флипаем чип под бар.
			const flip = rect.top - topLimit < EDGE_LABEL_CLEARANCE_PX;
			const next = {
				x: side === "start" ? rect.left : rect.right,
				y: flip ? rect.bottom : rect.top,
				text: msToDayLabel(dayMs),
				flip
			};
			const key = `${Math.round(next.x)}|${Math.round(next.y)}|${next.text}|${flip}`;
			if (key === lastKeyRef.current) return;
			lastKeyRef.current = key;
			useEdgeLabelStore.getState().show(next);
		},
		[headerHeight]
	);

	const hide = useCallback(() => {
		lastKeyRef.current = null;
		useEdgeLabelStore.getState().hide();
	}, []);

	const onResizeStart = useCallback(
		(e: ResizeStartEvent) => pushLabel(e.direction, edgeDay(e.direction, itemSpan)),
		[pushLabel, itemSpan.start, itemSpan.end]
	);

	const onResizeMove = useCallback(
		(e: ResizeMoveEvent) => {
			const span = getSpanFromResizeEvent(e);
			if (span) pushLabel(e.direction, edgeDay(e.direction, span));
		},
		[pushLabel, getSpanFromResizeEvent]
	);

	const onResizeEnd = hide;

	// Hover-подсказка края: только когда кнопка НЕ зажата (e.buttons === 0). Жест (drag/resize)
	// сюда не доходит. Capture-фаза не трогает onPointerMove библиотеки.
	const onPointerMoveCapture = useCallback(
		(e: PointerEvent<HTMLDivElement>) => {
			if (e.buttons !== 0) return;
			const side = edgeUnderCursor(e.clientX, e.currentTarget.getBoundingClientRect());
			if (side) pushLabel(side, edgeDay(side, itemSpan));
			else hide();
		},
		[pushLabel, hide, itemSpan.start, itemSpan.end]
	);

	// Проект на MouseSensor/TouchSensor: dnd-kit вешает onMouseDown/onTouchStart, которые
	// dnd-timeline (рассчитан на PointerSensor) перехватить не может — на крае разом стартуют
	// resize (pointer) и drag (mouse/touch). Глушим drag на capture-фазе у края: resize на
	// pointer-событиях не задет, а dnd-kit-активатор на том же узле уже не сработает.
	const blockDragOnEdge = useCallback((e: MouseEvent | TouchEvent) => {
		const clientX = "touches" in e ? e.touches[0]?.clientX : e.clientX;
		if (clientX === undefined) return;
		if (edgeUnderCursor(clientX, e.currentTarget.getBoundingClientRect())) e.stopPropagation();
	}, []);

	const onPointerLeave = useCallback(
		(e: PointerEvent<HTMLDivElement>) => {
			if (e.buttons === 0) hide();
		},
		[hide]
	);

	/** Совместить с setNodeRef из useItem: один ref-колбэк держит и наш nodeRef, и узел библиотеки. */
	const registerNode = useCallback((node: HTMLDivElement | null) => {
		nodeRef.current = node;
		scrollportRef.current = node?.closest<HTMLElement>("[data-timeline-scrollport]") ?? null;
	}, []);

	return {
		/** В useItem({ ...resizeHandlers }). */
		resizeHandlers: { onResizeStart, onResizeMove, onResizeEnd },
		/** На корневой div бара. */
		barProps: {
			onMouseDownCapture: blockDragOnEdge,
			onTouchStartCapture: blockDragOnEdge,
			onPointerMoveCapture,
			onPointerLeave
		},
		registerNode
	};
}
