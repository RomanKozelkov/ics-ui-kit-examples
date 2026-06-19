import { GROUP_HEAD_H, Z_INDEX } from "../utils/constants";

/**
 * Контентная половина строки-заголовка группы: пустая залипающая полоса с тонировкой,
 * выровненная по высоте с кнопкой группы в сайдбаре. Сам заголовок (кнопка) — в сайдбаре.
 */
export function ContentGroupBand({ top }: { top: number }) {
	return (
		<div
			aria-hidden
			className="sticky w-full border-b border-border"
			style={{ height: GROUP_HEAD_H, top, zIndex: Z_INDEX.sidebar }}
		>
			<div className="pointer-events-none absolute inset-0 bg-muted/40" />
		</div>
	);
}
