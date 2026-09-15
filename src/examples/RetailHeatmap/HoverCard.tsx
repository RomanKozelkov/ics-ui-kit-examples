import { PointCardHeader, PointRows } from "./PointCard";
import type { TradePoint } from "./types";

/** Тултип торговой точки при наведении на маркер (треб. 4.1, 4.2). */
export function HoverCard({ point }: { point: TradePoint }) {
	return (
		<div className="w-[268px] overflow-hidden rounded-[11px] border border-slate-200 bg-white shadow-[0_8px_16px_-4px_rgba(15,23,42,.2),0_4px_8px_-4px_rgba(15,23,42,.14)]">
			<div className="border-b border-slate-100 px-[13px] py-2.5">
				<PointCardHeader point={point} />
			</div>
			<div className="px-[13px] py-[11px]">
				<PointRows point={point} />
			</div>
		</div>
	);
}
