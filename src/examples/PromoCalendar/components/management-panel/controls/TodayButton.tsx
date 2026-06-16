import { Button } from "ics-ui-kit/components/button";
import { CalendarClock } from "lucide-react";
import { usePanelStore } from "../store/panel.store";
import { useText } from "../../../i18n";

export function TodayButton() {
	const year = usePanelStore((s) => s.year);
	const monthFrom = usePanelStore((s) => s.monthFrom);
	const monthTo = usePanelStore((s) => s.monthTo);
	const triggerShowToday = usePanelStore((s) => s.triggerShowToday);
	const text = useText();

	// Текущий день виден, только если сегодня попадает в выбранный год и диапазон месяцев.
	const now = new Date();
	const todayVisible = now.getFullYear() === year && now.getMonth() >= monthFrom && now.getMonth() <= monthTo;

	return (
		<Button variant="secondary" startIcon={CalendarClock} disabled={!todayVisible} onClick={triggerShowToday}>
			{text("panel.today")}
		</Button>
	);
}
