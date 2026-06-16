import { ToggleGroup, ToggleGroupItem } from "ics-ui-kit/components/toggle-group";
import { FilterField } from "../../../../../shared/bi-dashboard/ui/FilterField";
import { usePanelStore } from "../store/panel.store";
import { DAY_WIDTH_PRESETS, isDayWidth } from "../data/options";
import { useText } from "../../../i18n";

export function ZoomSelect() {
	const dayWidth = usePanelStore((s) => s.dayWidth);
	const setDayWidth = usePanelStore((s) => s.setDayWidth);
	const text = useText();

	return (
		<FilterField label={text("panel.zoom")}>
			<ToggleGroup
				type="single"
				variant="outline"
				value={String(dayWidth)}
				// Radix отдаёт "" при попытке снять активный пункт — игнорим, масштаб обязателен.
				onValueChange={(v) => {
					const next = Number(v);
					if (isDayWidth(next)) setDayWidth(next);
				}}
			>
				{DAY_WIDTH_PRESETS.map((o) => (
					<ToggleGroupItem key={o.value} value={String(o.value)}>
						{text(o.i18nKey)}
					</ToggleGroupItem>
				))}
			</ToggleGroup>
		</FilterField>
	);
}
