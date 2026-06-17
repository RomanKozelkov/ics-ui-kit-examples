import { Suspense, type ReactNode } from "react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "./ErrorBoundary";

/**
 * Suspense + reset-aware error boundary под React Query suspense-запросы.
 * QueryErrorResetBoundary.reset чистит закэшированную ошибку запроса, ErrorBoundary.reset —
 * локальное состояние границы. reset из fallback дёргает оба → честный рефетч, а не показ
 * той же ошибки. Симметрия loading/error в одном месте: оба гейта suspense-ветки здесь.
 */
export function QueryBoundary({
	loading,
	error,
	children
}: {
	loading: ReactNode;
	error: (args: { reset: () => void }) => ReactNode;
	children: ReactNode;
}) {
	return (
		<QueryErrorResetBoundary>
			{({ reset }) => (
				<ErrorBoundary onReset={reset} fallback={({ reset: resetBoundary }) => error({ reset: resetBoundary })}>
					<Suspense fallback={loading}>{children}</Suspense>
				</ErrorBoundary>
			)}
		</QueryErrorResetBoundary>
	);
}
