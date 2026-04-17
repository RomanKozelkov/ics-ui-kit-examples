import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue
} from "ics-ui-kit/components/select";

export function FilterYear() {
	return (
		<label className="flex flex-col gap-2 space-y-0">
			<span className="text-sm font-medium leading-none text-primary-fg">Год анализа</span>
			<Select defaultValue="2025">
				<SelectTrigger>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>Год анализа</SelectLabel>
						<SelectItem value="2022">2022</SelectItem>
						<SelectItem value="2023">2023</SelectItem>
						<SelectItem value="2024">2024</SelectItem>
						<SelectItem value="2025">2025</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		</label>
	);
}
