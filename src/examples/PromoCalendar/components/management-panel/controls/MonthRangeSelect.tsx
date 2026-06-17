import { useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "ics-ui-kit/components/select";
import { Field } from "ics-ui-kit/components/field";
import { usePanelStore } from "../store/panel.store";
import { useLocale, useText } from "../../../i18n";

function getMonthNames(locale: string): string[] {
	const f = new Intl.DateTimeFormat(locale, { month: "long" });
	return Array.from({ length: 12 }, (_, i) => {
		const name = f.format(new Date(2000, i, 1));
		return name.charAt(0).toUpperCase() + name.slice(1);
	});
}

export function MonthRangeSelect() {
	const monthFrom = usePanelStore((s) => s.monthFrom);
	const monthTo = usePanelStore((s) => s.monthTo);
	const setMonthFrom = usePanelStore((s) => s.setMonthFrom);
	const setMonthTo = usePanelStore((s) => s.setMonthTo);
	const text = useText();
	const locale = useLocale();

	const months = useMemo(() => getMonthNames(locale), [locale]);

	return (
		<Field
			className="w-auto"
			layout="vertical"
			title={text("panel.months")}
			control={() => (
				<div className="flex items-center gap-2">
					<Select value={String(monthFrom)} onValueChange={(v) => setMonthFrom(Number(v))}>
						<SelectTrigger className="w-36">
							<SelectValue placeholder={text("panel.monthFrom")} />
						</SelectTrigger>
						<SelectContent>
							{months.map((m, i) => (
								<SelectItem key={m} value={String(i)} disabled={i > monthTo}>
									{m}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<span className="text-sm text-muted-foreground">—</span>

					<Select value={String(monthTo)} onValueChange={(v) => setMonthTo(Number(v))}>
						<SelectTrigger className="w-36">
							<SelectValue placeholder={text("panel.monthTo")} />
						</SelectTrigger>
						<SelectContent>
							{months.map((m, i) => (
								<SelectItem key={m} value={String(i)} disabled={i < monthFrom}>
									{m}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			)}
		/>
	);
}
