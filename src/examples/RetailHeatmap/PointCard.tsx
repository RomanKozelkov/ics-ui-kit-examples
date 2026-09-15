import type { ReactNode } from "react";
import { formatMetric } from "../../shared/bi-dashboard/format";
import { POINT_TYPE_MAP, catColor, type PointType, type TradePoint } from "./types";
import { NETWORK_TYPES } from "./types";

/**
 * Состав карточки торговой точки (треб. 4.1, 4.2). Один и тот же набор используется
 * в тултипе на карте и в правой панели (треб. 5.4.1).
 */

/** Круглый значок типа точки: цвет группы + SVG-иконка. */
export function PointTypeGlyph({ type, size = 28 }: { type: PointType; size?: number }) {
	const meta = POINT_TYPE_MAP[type];
	const icon = Math.round(size * 0.54);
	return (
		<span
			className="flex flex-none items-center justify-center rounded-full"
			style={{ background: meta.color, width: size, height: size }}
		>
			<svg
				viewBox="0 0 24 24"
				width={icon}
				height={icon}
				fill="none"
				stroke="#fff"
				strokeWidth={2.2}
				strokeLinecap="round"
				strokeLinejoin="round"
				dangerouslySetInnerHTML={{ __html: meta.icon }}
			/>
		</span>
	);
}

const networkLabel = (key: string) => NETWORK_TYPES.find((n) => n.key === key)?.label ?? key;

/** Семь строк «показатель / значение» в порядке треб. 4.2. */
export function PointRows({ point }: { point: TradePoint }) {
	const rows: { label: string; value: ReactNode }[] = [
		{ label: "Наименование", value: <span className="font-semibold text-slate-900">{point.name}</span> },
		{
			label: "Тип торговой точки",
			// Целевая группа — основное значение; подтип справочника показываем, когда он её уточняет.
			value: (
				<span className="font-semibold text-slate-900">
					{POINT_TYPE_MAP[point.type].label}
					{point.subtype !== POINT_TYPE_MAP[point.type].label && (
						<span className="block font-normal text-slate-500">{point.subtype}</span>
					)}
				</span>
			)
		},
		{
			label: "Категория",
			value: (
				<span
					className="rounded px-[7px] font-semibold text-white"
					style={{ background: catColor(point.category) }}
				>
					{point.category}
				</span>
			)
		},
		{
			label: "ТОП-50 %",
			value: (
				<span className={point.top50 ? "font-semibold text-slate-900" : "font-semibold text-slate-500"}>
					{point.top50 ? "ТОП-50 %" : "не ТОП-50 %"}
				</span>
			)
		},
		{
			label: "Тип сети точки",
			value: <span className="font-semibold text-slate-900">{networkLabel(point.network)}</span>
		},
		{
			label: "mAVG offtake",
			value: (
				<span className="font-semibold tabular-nums text-slate-900">
					{formatMetric(point.offtake, "RUB", "full")}
				</span>
			)
		},
		{
			label: "mAVG turnover",
			value: (
				<span className="font-semibold tabular-nums text-slate-900">
					{formatMetric(point.turnover, "RUB", "full")}
				</span>
			)
		}
	];

	return (
		<div className="flex flex-col gap-2">
			{rows.map((row) => (
				<div key={row.label} className="flex items-start justify-between gap-3 text-[12px]">
					<span className="flex-none text-slate-500">{row.label}</span>
					<span className="min-w-0 text-right">{row.value}</span>
				</div>
			))}
		</div>
	);
}

/** Шапка карточки: маркер типа, код точки, название типа (треб. 4.1). */
export function PointCardHeader({ point }: { point: TradePoint }) {
	const meta = POINT_TYPE_MAP[point.type];
	return (
		<div className="flex items-center gap-2">
			<span className="h-[11px] w-[11px] flex-none rounded-full" style={{ background: meta.color }} />
			<span className="font-mono text-[12px] font-bold text-slate-900">{point.code}</span>
			<span className="ml-auto truncate text-[11px] text-slate-500">{meta.label}</span>
		</div>
	);
}
