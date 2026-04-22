import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue
} from "ics-ui-kit/components/select";
import { useFiltersStore, type Currency } from "../../stores/useFiltersStore";
import { FilterField } from "../components/FilterField";

export function FilterCurrency() {
	const currency = useFiltersStore((s) => s.currency);
	const setCurrency = useFiltersStore((s) => s.setCurrency);

	return (
		<FilterField label="Валюта">
			<Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
				<SelectTrigger>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectItem value="RUB">RUB</SelectItem>
						<SelectItem value="USD">USD</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		</FilterField>
	);
}
