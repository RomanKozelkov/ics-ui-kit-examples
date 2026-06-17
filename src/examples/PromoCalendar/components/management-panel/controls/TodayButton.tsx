import { Button } from "ics-ui-kit/components/button";
import { CalendarClock } from "lucide-react";
import { usePanelStore } from "../store/panel.store";
import { useText } from "../../../i18n";

export function TodayButton() {
	const goToToday = usePanelStore((s) => s.goToToday);
	const years = usePanelStore((s) => s.years);
	const text = useText();

	// Сегодня — реальная дата: кнопка сама переключит период. Блокируем только если текущий
	// год вообще недоступен в Select (тогда показать сегодня физически нельзя).
	const todayReachable = years.includes(new Date().getFullYear());

	return (
		<Button variant="secondary" startIcon={CalendarClock} disabled={!todayReachable} onClick={goToToday}>
			{text("panel.today")}
		</Button>
	);
}
