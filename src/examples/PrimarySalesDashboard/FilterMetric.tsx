import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue
} from "ics-ui-kit/components/select";

export function FilterMetric() {
	return (
		<label className="flex flex-col gap-2 space-y-0">
			<span className="text-sm font-medium leading-none text-primary-fg">Метрика</span>
			<Select defaultValue="Units">
				<SelectTrigger>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>Метрика</SelectLabel>
						<SelectItem value="Value">Value</SelectItem>
						<SelectItem value="Units">Units</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		</label>
	);
}
