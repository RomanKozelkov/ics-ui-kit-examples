import { HEAD_MONTH_H, MONTH_LABEL_GAP, MS_DAY } from "../utils/constants";
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
	valueToPixels,
	labelOffset
}: {
	months: TimelineMonth[];
	valueToPixels: (value: number) => number;
	/** Ширина залипающей сайдбар-колонки; метка месяца залипает правее неё, иначе колонка её перекрывает. */
	labelOffset: number;
}) {
	return (
		<div className="flex" style={{ height: HEAD_MONTH_H }}>
			{months.map((m) => (
				<div
					key={m.key}
					className="relative flex h-full shrink-0 items-center border-r border-border"
					style={{ width: valueToPixels(m.dayCount * MS_DAY) }}
				>
					<span
						className="sticky whitespace-nowrap px-1 text-xs font-semibold text-primary-fg"
						style={{ left: labelOffset + MONTH_LABEL_GAP }}
					>
						{MONTHS_RU[m.month]}
						<span className="font-normal text-muted-foreground"> {m.year}</span>
					</span>
				</div>
			))}
		</div>
	);
}
