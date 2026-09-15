import { useState } from "react";
import { formatMetric } from "../../shared/bi-dashboard/format";
import { EMPLOYEES } from "./mockData";
import { isValueSelected, type FilterDimension, type FilterState } from "./filters";
import { ROLE_ORDER, type Stats } from "./stats";
import {
	CATEGORIES,
	NETWORK_TYPES,
	POINT_TYPES,
	TOP50_VALUES,
	catColor,
	type EmployeeRole
} from "./types";

/**
 * Блоки статистики по атрибутам точек (треб. 5.3.2, пункты 2–6).
 *
 * Значения кликабельны: клик применяет фильтр по значению, повторный — снимает его
 * (треб. 5.5.1, 5.5.5), выбранные значения выделены (треб. 5.5.6). Область действия фильтра
 * задаёт вызывающая сторона — глобальный или в границах территории (треб. 5.5.2).
 */

export type StatItem = {
	key: string;
	label: string;
	count: number;
	color?: string;
	group?: string;
};

type BlockProps = {
	title: string;
	dimension: FilterDimension;
	items: StatItem[];
	filters: FilterState;
	onToggle: (dimension: FilterDimension, value: string) => void;
};

const TILE_BASE =
	"flex flex-col items-center rounded-[9px] border px-1 py-[9px] text-center transition-colors";
const ROW_BASE =
	"flex w-full items-center gap-2 rounded-[8px] border px-2 py-[7px] text-left transition-colors";
const IDLE = "border-slate-200 bg-white hover:bg-slate-50";
const SELECTED = "border-slate-900 bg-slate-50 ring-1 ring-slate-900";

function BlockTitle({ children }: { children: React.ReactNode }) {
	return <div className="mb-2.5 text-[13px] font-semibold text-slate-900">{children}</div>;
}

/** Компактная раскладка плитками — для коротких подписей (категории, ТОП-50 %). */
export function StatTiles({ title, dimension, items, filters, onToggle }: BlockProps) {
	return (
		<div>
			<BlockTitle>{title}</BlockTitle>
			<div className="flex gap-[9px]">
				{items.map((item) => {
					const selected = isValueSelected(filters, dimension, item.key);
					return (
						<button
							key={item.key}
							type="button"
							onClick={() => onToggle(dimension, item.key)}
							aria-pressed={selected}
							className={`${TILE_BASE} min-w-0 flex-1 ${selected ? SELECTED : IDLE}`}
						>
							<span className="flex items-center justify-center gap-1.5">
								{item.color && (
									<span className="h-2 w-2 flex-none rounded-full" style={{ background: item.color }} />
								)}
								<span className="truncate text-[13px] font-bold text-slate-900">{item.label}</span>
							</span>
							<span className="mt-[3px] text-[13px] tabular-nums text-slate-500">{item.count}</span>
						</button>
					);
				})}
			</div>
		</div>
	);
}

/** Раскладка строками — для длинных подписей (типы точек, типы сети, сотрудники). */
export function StatRows({
	title,
	dimension,
	items,
	filters,
	onToggle,
	collapseAfter
}: BlockProps & { collapseAfter?: number }) {
	const [expanded, setExpanded] = useState(false);
	const limit = collapseAfter ?? items.length;
	const visible = expanded ? items : items.slice(0, limit);
	const groups: { group?: string; rows: StatItem[] }[] = [];
	for (const item of visible) {
		const last = groups[groups.length - 1];
		if (last && last.group === item.group) last.rows.push(item);
		else groups.push({ group: item.group, rows: [item] });
	}

	return (
		<div>
			<BlockTitle>{title}</BlockTitle>
			<div className="flex flex-col gap-[7px]">
				{groups.map((group) => (
					<div key={group.group ?? "_"} className="flex flex-col gap-[5px]">
						{group.group && (
							<div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
								{group.group}
							</div>
						)}
						{group.rows.map((item) => {
							const selected = isValueSelected(filters, dimension, item.key);
							return (
								<button
									key={item.key}
									type="button"
									onClick={() => onToggle(dimension, item.key)}
									aria-pressed={selected}
									className={`${ROW_BASE} ${selected ? SELECTED : IDLE}`}
								>
									{item.color && (
										<span
											className="h-[9px] w-[9px] flex-none rounded-full"
											style={{ background: item.color }}
										/>
									)}
									<span className="min-w-0 flex-1 truncate text-[12px] text-slate-700">{item.label}</span>
									<span className="flex-none text-[12px] font-semibold tabular-nums text-slate-900">
										{formatMetric(item.count, "Units", "full")}
									</span>
								</button>
							);
						})}
					</div>
				))}
			</div>
			{items.length > limit && (
				<button
					type="button"
					onClick={() => setExpanded((v) => !v)}
					className="mt-2 text-[12px] font-medium text-slate-500 hover:text-slate-900"
				>
					{expanded ? "Свернуть" : `Показать все (${items.length})`}
				</button>
			)}
		</div>
	);
}

/* ---------- сборка значений блоков ---------- */

export const typeItems = (stats: Stats): StatItem[] =>
	POINT_TYPES.map((t) => ({ key: t.key, label: t.label, count: stats.byType[t.key] ?? 0, color: t.color }));

export const categoryItems = (stats: Stats): StatItem[] => {
	// Категории из справочника плюс встретившиеся в данных значения вне его.
	const keys = [...CATEGORIES, ...Object.keys(stats.byCategory).filter((k) => !CATEGORIES.includes(k))];
	return keys.map((key) => ({ key, label: key, count: stats.byCategory[key] ?? 0, color: catColor(key) }));
};

export const top50Items = (stats: Stats): StatItem[] =>
	TOP50_VALUES.map((t) => ({ key: t.key, label: t.label, count: stats.byTop50[t.key] ?? 0 }));

export const networkItems = (stats: Stats): StatItem[] =>
	NETWORK_TYPES.map((n) => ({ key: n.key, label: n.label, count: stats.byNetwork[n.key] ?? 0 }));

/** Сотрудники по иерархии: сначала ASM, затем DSM, затем MR; пустые уровни не показываем. */
export const employeeItems = (stats: Stats): StatItem[] => {
	const roleLabel: Record<EmployeeRole, string> = { MR: "MR", DSM: "DSM", ASM: "ASM" };
	const result: StatItem[] = [];
	for (const role of [...ROLE_ORDER].reverse()) {
		const rows = EMPLOYEES.filter((e) => e.role === role && (stats.byEmployee[e.id] ?? 0) > 0)
			.map((e) => ({ key: e.id, label: e.name, count: stats.byEmployee[e.id] ?? 0, group: roleLabel[role] }))
			.sort((a, b) => b.count - a.count);
		result.push(...rows);
	}
	return result;
};
