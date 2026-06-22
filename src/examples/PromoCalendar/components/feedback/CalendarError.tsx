import { ErrorState, Retry } from "ics-ui-kit/components/error-state";
import { RotateCcw } from "lucide-react";
import { useText } from "../../i18n";

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
