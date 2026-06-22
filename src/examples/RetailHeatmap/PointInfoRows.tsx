import type { ReactNode } from "react";
import { formatMetric } from "../../shared/bi-dashboard/format";
import type { TradePoint } from "./types";

/** Строки с атрибутами торговой точки — общие для hover-карточки и карточки в правой панели. */
export function PointInfoRows({ point, showDistrict }: { point: TradePoint; showDistrict?: boolean }) {
	const rows: { label: string; value: ReactNode }[] = [
		{
			label: "Категория",
			value: (
				<span className="rounded bg-slate-100 px-[7px] font-semibold text-slate-900">{point.cat}</span>
			)
		},
		{
			label: "Оборот",
			value: (
				<span className="font-semibold tabular-nums text-slate-900">
					{formatMetric(point.turnover, "RUB", "full")}
				</span>
			)
		},
		{
			label: "Ответственный",
			value: (
				<span className={point.manager ? "font-semibold text-slate-900" : "font-semibold text-red-700"}>
					{point.manager ?? "Не назначен"}
				</span>
			)
		},
		{
			label: "Население (охват)",
			value: (
				<span className="font-semibold tabular-nums text-slate-900">
					{formatMetric(point.pop, "Units", "full")} чел.
				</span>
			)
		}
	];
	if (showDistrict) {
		rows.push({
			label: "Район",
			value: <span className="font-semibold text-slate-900">{point.district}</span>
		});
	}

	return (
		<div className="flex flex-col gap-2">
			{rows.map((r) => (
				<div key={r.label} className="flex items-center justify-between text-[12px]">
					<span className="text-slate-500">{r.label}</span>
					{r.value}
				</div>
			))}
		</div>
	);
}
