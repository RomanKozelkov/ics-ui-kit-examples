import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue
} from "ics-ui-kit/components/select";

export function FilterPeriod() {
	return (
		<label className="flex flex-col gap-2 space-y-0">
			<span className="text-sm font-medium leading-none text-primary-fg">Период</span>
			<Select defaultValue="FY">
				<SelectTrigger>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>Период</SelectLabel>
						<SelectItem value="FY">FY</SelectItem>
						<SelectItem value="YTD">YTD</SelectItem>
						<SelectItem value="QTD">QTD</SelectItem>
						<SelectItem value="MTD">MTD</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		</label>
	);
}
