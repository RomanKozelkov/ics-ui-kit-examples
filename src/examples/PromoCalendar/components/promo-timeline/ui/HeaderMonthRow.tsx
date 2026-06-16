import { HEAD_MONTH_H, MS_DAY } from "../utils/constants";
import type { TimelineMonth } from "../utils/timeline";

const MONTHS_RU = [
	"Январь",
	"Февраль",
	"Март",
	"Апрель",
	"Май",
	"Июнь",
	"Июль",
	"Август",
	"Сентябрь",
	"Октябрь",
	"Ноябрь",
	"Декабрь"
];

export function HeaderMonthRow({
	months,
	valueToPixels
}: {
	months: TimelineMonth[];
	valueToPixels: (value: number) => number;
}) {
	return (
		<div className="flex" style={{ height: HEAD_MONTH_H }}>
			{months.map((m) => (
				<div
					key={m.key}
					className="relative flex h-full shrink-0 items-center border-r border-border"
					style={{ width: valueToPixels(m.dayCount * MS_DAY) }}
				>
					<span className="sticky left-2 whitespace-nowrap px-1 text-xs font-semibold text-primary-fg">
						{MONTHS_RU[m.month]}
						<span className="font-normal text-muted-foreground"> {m.year}</span>
					</span>
				</div>
			))}
		</div>
	);
}
