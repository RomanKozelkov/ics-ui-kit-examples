import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue
} from "ics-ui-kit/components/select";

export function FilterCurrency() {
	return (
		<label className="flex flex-col gap-2 space-y-0">
			<span className="text-sm font-medium leading-none text-primary-fg">Валюта</span>
			<Select defaultValue="RUB">
				<SelectTrigger>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>Валюта</SelectLabel>
						<SelectItem value="RUB">RUB</SelectItem>
						<SelectItem value="USD">USD</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		</label>
	);
}
