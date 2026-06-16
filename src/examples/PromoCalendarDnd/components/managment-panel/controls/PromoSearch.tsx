import { useEffect, useState } from "react";
import { TextInput } from "ics-ui-kit/components/input";
import { Icon } from "ics-ui-kit/components/icon";
import { Search } from "lucide-react";
import { FilterField } from "../../../../../shared/bi-dashboard/ui/FilterField";
import { useDebounce } from "../../../../../shared/hooks/useDebounce";
import { usePanelStore } from "../store/usePanelStore";
import { useText } from "../../../i18n";

export function PromoSearch() {
	const setSearch = usePanelStore((s) => s.setSearch);
	const text = useText();

	// Локальный state управляет инпутом; в store (и localStorage, и даунстрим-фильтр)
	// уходит только дебаунснутое значение, а не каждый набранный символ.
	const [value, setValue] = useState(() => usePanelStore.getState().search);
	const debounced = useDebounce(value, 300);

	useEffect(() => {
		setSearch(debounced);
	}, [debounced, setSearch]);

	return (
		<FilterField label={text("panel.search")}>
			<TextInput
				className="w-56"
				value={value}
				onChange={(v) => setValue(v ?? "")}
				placeholder={text("panel.searchPlaceholder")}
				startIcon={<Icon icon={Search} />}
				showClearIcon
			/>
		</FilterField>
	);
}
