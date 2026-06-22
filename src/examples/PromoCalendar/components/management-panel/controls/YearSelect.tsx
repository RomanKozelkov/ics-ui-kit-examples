import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "ics-ui-kit/components/select";
import { Field } from "ics-ui-kit/components/field";
import { usePanelStore } from "../store/panel.store";
import { useText } from "../../../i18n";
import { useCallback } from "react";

export function YearSelect() {
	const year = usePanelStore((s) => s.year);
	const setYear = usePanelStore((s) => s.setYear);
	const years = usePanelStore((s) => s.years);
	const text = useText();

	const handleYearChange = useCallback((value: string) => setYear(Number(value)), [setYear]);

	return (
		<Field
			className="w-auto"
			layout="horizontal"
			title={text("panel.year") + ":"}
			control={({ id }) => (
				<Select value={String(year)} onValueChange={handleYearChange}>
					<SelectTrigger id={id} className="w-28">
						<SelectValue placeholder={text("panel.year")} />
					</SelectTrigger>
					<SelectContent>
						{years.map((y) => (
							<SelectItem key={y} value={String(y)}>
								{y}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			)}
		/>
	);
}
