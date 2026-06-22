import { PointInfoRows } from "./PointInfoRows";
import { TYPE_MAP, type TradePoint } from "./types";

/** Плавающая карточка точки (Сценарий 2) — показывается у маркера при наведении. */
export function HoverCard({ point }: { point: TradePoint }) {
	const t = TYPE_MAP[point.type];
	return (
		<div className="w-60 overflow-hidden rounded-[11px] border border-slate-200 bg-white shadow-[0_8px_16px_-4px_rgba(15,23,42,.2),0_4px_8px_-4px_rgba(15,23,42,.14)]">
			<div className="flex items-center gap-2 border-b border-slate-100 px-[13px] py-2.5">
				<span className="h-[11px] w-[11px] flex-none rounded-full" style={{ background: t.color }} />
				<span className="font-mono text-[12px] font-bold text-slate-900">{point.code}</span>
				<span className="ml-auto text-[11px] text-slate-500">{t.label}</span>
			</div>
			<div className="px-[13px] py-[11px]">
				<PointInfoRows point={point} />
			</div>
		</div>
	);
}
