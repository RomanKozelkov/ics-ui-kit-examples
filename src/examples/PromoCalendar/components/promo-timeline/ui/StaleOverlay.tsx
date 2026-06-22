import type { ReactNode } from "react";

// Класс «несвежего» полотна: лёгкий blur + приглушение, пока deferred-значения догоняют актуальные.
// 2px/0.6 — заметно, но таймлайн остаётся читаемым; 200ms — мягкое проявление без ощущения лага.
const STALE_CLASS = "pointer-events-none opacity-60 blur-[2px]";
// Базовый бокс должен сам быть flex-1 min-h-0 flex-col: внутри лежит CalendarSurface (flex-1),
// и без этого полотно схлопнется по высоте. filter/opacity анимируем для плавного перехода.
const BASE_CLASS = "flex min-h-0 flex-1 flex-col transition-[filter,opacity] duration-200";

/**
 * Держит предыдущий таймлайн на экране и накрывает его blur + inert, пока deferred-значения
 * (год / группировка / масштаб) догоняют актуальные. Заменяет полноэкранный лоадер при смене
 * состояния в ManagementPanel — мигает только первый рендер (когда кэша ещё нет).
 */
export function StaleOverlay({ stale, children }: { stale: boolean; children: ReactNode }) {
	return (
		<div inert={stale || undefined} className={stale ? `${BASE_CLASS} ${STALE_CLASS}` : BASE_CLASS}>
			{children}
		</div>
	);
}
