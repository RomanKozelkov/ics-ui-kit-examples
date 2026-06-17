import { Component, type ReactNode } from "react";

type ErrorBoundaryProps = {
	/** Render-prop фоллбэка; reset — повторная попытка (сбрасывает состояние границы). */
	fallback: (args: { error: Error; reset: () => void }) => ReactNode;
	/** Дёргается при reset перед очисткой состояния. Связать с QueryErrorResetBoundary.reset. */
	onReset?: () => void;
	children: ReactNode;
};

type ErrorBoundaryState = { error: Error | null };

/**
 * Generic error boundary. Ошибки рендера и throw из Suspense-запросов React ловит
 * только class-границей — хуками нельзя. Fallback как render-prop, чтобы переиспользовать
 * границу с любым UI ошибки, не привязываясь к конкретному компоненту.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	state: ErrorBoundaryState = { error: null };

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { error };
	}

	private reset = () => {
		this.props.onReset?.();
		this.setState({ error: null });
	};

	render() {
		const { error } = this.state;
		if (error) return this.props.fallback({ error, reset: this.reset });
		return this.props.children;
	}
}
