import { MultiSelect, type LoadOptionsParams, type SearchSelectOption } from "ics-ui-kit/components/search-select";
import { Field } from "ics-ui-kit/components/field";
import { useMemo } from "react";
import { usePanelStore } from "../store/panel.store";
import { GROUPING_OPTIONS, isGrouping } from "../data/options";
import { useText } from "../../../i18n";

export function GroupingSelect() {
	const grouping = usePanelStore((s) => s.grouping);
	const setGrouping = usePanelStore((s) => s.setGrouping);
	const text = useText();

	// Лейблы — из переводов; собираем здесь, т.к. data-слой не знает про i18n.
	const options = useMemo<SearchSelectOption[]>(
		() => GROUPING_OPTIONS.map((o) => ({ value: o.value, label: text(o.labelKey) })),
		[text]
	);

	// Порядок выбранных уровней = вложенность группировки, поэтому маппим из grouping, а не из опций.
	const value = useMemo(
		() => grouping.map((g) => options.find((o) => o.value === g)).filter((o): o is SearchSelectOption => Boolean(o)),
		[grouping, options]
	);

	// Список короткий и статичный — отдаём синхронно, фильтруя по строке поиска.
	const loadOptions = useMemo(
		() => async ({ searchQuery }: LoadOptionsParams) => ({
			options: options.filter((o) => o.label.toLowerCase().includes(searchQuery.toLowerCase()))
		}),
		[options]
	);

	return (
		<Field
			className="w-auto"
			layout="vertical"
			title={text("panel.grouping")}
			control={() => (
				<MultiSelect
					className="w-44"
					value={value}
					onChange={(selected) => setGrouping(selected.map((o) => o.value).filter(isGrouping))}
					loadOptions={loadOptions}
					placeholder={text("panel.grouping")}
					hideSearch
				/>
			)}
		/>
	);
}
