import { Loader } from "ics-ui-kit/components/loader";
import { ErrorState, Retry } from "ics-ui-kit/components/error-state";
import { RotateCcw } from "lucide-react";
import { useText } from "../../i18n";

/** Единый лоадер календаря: один источник текста для гейтов и Suspense-фоллбэков (DRY). */
export function CalendarLoader() {
	const text = useText();
	return <Loader>{text("calendar.loading")}</Loader>;
}

/**
 * Ошибка календаря с повтором. onRetry дёргает рефетч / сброс error-границы.
 * Композиция по канону ui-kit (ErrorState.WithErrorState): текст в span + Retry с иконкой.
 */
export function CalendarError({ onRetry }: { onRetry?: () => void }) {
	const text = useText();
	return (
		<ErrorState>
			<span>{text("calendar.error")}</span>
			{onRetry && (
				<Retry onClick={onRetry}>
					<RotateCcw />
					{text("calendar.retry")}
				</Retry>
			)}
		</ErrorState>
	);
}
