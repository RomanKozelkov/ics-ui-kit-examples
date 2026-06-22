import { Loader } from "ics-ui-kit/components/loader";
import { useText } from "../../i18n";

export function CalendarLoader() {
	const text = useText();
	return <Loader>{text("calendar.loading")}</Loader>;
}
