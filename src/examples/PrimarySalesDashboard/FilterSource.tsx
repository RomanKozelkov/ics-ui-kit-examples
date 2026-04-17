import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue
} from "ics-ui-kit/components/select";

export function FilterSource() {
	return (
		<label className="flex flex-col gap-2 space-y-0">
			<span className="text-sm font-medium leading-none text-primary-fg">Источник данных</span>
			<Select defaultValue="MDLP">
				<SelectTrigger>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>Источник данных</SelectLabel>
						<SelectItem value="MDLP">MDLP</SelectItem>
						<SelectItem value="ERP">ERP</SelectItem>
						<SelectItem value="Manual">Manual</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		</label>
	);
}
