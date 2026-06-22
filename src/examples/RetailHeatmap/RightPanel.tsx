import { ArrowLeft, ChevronRight, Crosshair, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Divider } from "ics-ui-kit/components/divider";
import { Badge } from "ics-ui-kit/components/badge";
import { Toggle } from "ics-ui-kit/components/toggle";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "ics-ui-kit/components/dropdown";
import { formatMetric } from "../../shared/bi-dashboard/format";
import { PointInfoRows } from "./PointInfoRows";
import { CAT_COLORS, TYPES, TYPE_MAP, type Category, type PointType, type TradePoint } from "./types";
import { GLOBAL_STATS, type Brick, type BrickStats } from "./bricks";

export type Selection =
	| { kind: "point"; point: TradePoint }
	| { kind: "brick"; id: string }
	| null;

function initials(name: string) {
	if (name === "Unknown") return "?";
	return name
		.replace(/\./g, "")
		.trim()
		.split(/\s+/)
		.map((s) => s[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

/* ---------- переиспользуемые блоки ---------- */

function Kpi({ label, value, big }: { label: string; value: string; big?: boolean }) {
	return (
		<div className="min-w-0 rounded-[10px] border border-slate-200 px-2.5 py-[11px]">
			<div className="text-[11px] text-slate-500">{label}</div>
			<div
				className={
					(big ? "mt-[3px] text-[21px]" : "mt-[5px] text-[16px]") +
					" font-bold tabular-nums tracking-[-.01em] text-slate-900"
				}
			>
				{value}
			</div>
		</div>
	);
}

function KpiCards({ stats }: { stats: BrickStats }) {
	return (
		<div className="grid grid-cols-3 gap-[9px]">
			<Kpi label="Точек" value={formatMetric(stats.count, "Units", "full")} big />
			<Kpi label="Оборот / мес" value={formatMetric(stats.totalTurnover, "RUB", "full")} />
			<Kpi label="Население" value={formatMetric(stats.population, "Units", "full")} />
		</div>
	);
}

function TypeComposition({ stats }: { stats: BrickStats }) {
	const maxType = Math.max(1, ...TYPES.map((t) => stats.byType[t.key] || 0));
	return (
		<div>
			<div className="mb-3 text-[13px] font-semibold text-slate-900">Состав по типам</div>
			<div className="flex flex-col gap-[11px]">
				{TYPES.map((t) => {
					const c = stats.byType[t.key] || 0;
					return (
						<div key={t.key} className="flex items-start gap-2.5">
							<span className="mt-1 h-[9px] w-[9px] flex-none rounded-full" style={{ background: t.color }} />
							<div className="flex flex-1 flex-col gap-1">
								<div className="flex justify-between text-[13px]">
									<span className="text-slate-700">{t.label}</span>
									<span className="font-semibold tabular-nums text-slate-900">
										{formatMetric(c, "Units", "full")}
									</span>
								</div>
								<div className="h-1.5 overflow-hidden rounded bg-slate-100">
									<div
										className="h-full rounded"
										style={{ width: (c / maxType) * 100 + "%", background: t.color }}
									/>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

function Categories({ stats }: { stats: BrickStats }) {
	return (
		<div>
			<div className="mb-3 text-[13px] font-semibold text-slate-900">Категории точек</div>
			<div className="flex gap-[9px]">
				{(["A", "B", "C", "D"] as Category[]).map((c) => (
					<div key={c} className="flex-1 rounded-[9px] border border-slate-200 px-1 py-[9px] text-center">
						<div className="flex items-center justify-center gap-1.5">
							<span className="h-2 w-2 rounded-full" style={{ background: CAT_COLORS[c] }} />
							<span className="text-[17px] font-bold text-slate-900">{c}</span>
						</div>
						<div className="mt-[3px] text-[13px] text-slate-500">{stats.byCat[c] || 0}</div>
					</div>
				))}
			</div>
		</div>
	);
}

function Managers({ stats }: { stats: BrickStats }) {
	const rows = Object.entries(stats.managers)
		.map(([name, count]) => ({ name, count }))
		.sort((a, b) => b.count - a.count);
	return (
		<div>
			<div className="mb-1.5 text-[13px] font-semibold text-slate-900">Ответственные менеджеры</div>
			{rows.map((m) => {
				const unknown = m.name === "Unknown";
				return (
					<div key={m.name} className="flex items-center gap-2.5 border-b border-slate-100 py-2">
						<span
							className={
								"flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold " +
								(unknown ? "bg-red-50 text-red-700" : "bg-slate-100 text-slate-700")
							}
						>
							{initials(m.name)}
						</span>
						<span className="flex-1 text-[13px] text-slate-900">{unknown ? "Не назначен" : m.name}</span>
						<span className="text-[12px] tabular-nums text-slate-500">
							{formatMetric(m.count, "Units", "full")} тт
						</span>
					</div>
				);
			})}
		</div>
	);
}

/* ---------- режимы панели ---------- */

/** Круглый значок типа точки (цвет + SVG-иконка) — для шапки выбранной точки. */
function PointTypeGlyph({ type }: { type: PointType }) {
	const t = TYPE_MAP[type];
	return (
		<span
			className="flex h-7 w-7 flex-none items-center justify-center rounded-full"
			style={{ background: t.color }}
		>
			<svg
				viewBox="0 0 24 24"
				width="15"
				height="15"
				fill="none"
				stroke="#fff"
				strokeWidth={2.2}
				strokeLinecap="round"
				strokeLinejoin="round"
				dangerouslySetInnerHTML={{ __html: t.icon }}
			/>
		</span>
	);
}

function SelectedBrickView({ brick, editing }: { brick: Brick; editing: boolean }) {
	return (
		<div className="flex flex-col gap-[22px]">
			{editing && (
				<div className="rounded-[10px] border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[12px] text-slate-600">
					Перетаскивайте точки на границе брика, чтобы изменить форму. Клик по средней точке
					добавляет вершину, двойной или правый клик по вершине удаляет её.
				</div>
			)}
			<KpiCards stats={brick.stats} />
			<TypeComposition stats={brick.stats} />
			<Categories stats={brick.stats} />
			<Managers stats={brick.stats} />
		</div>
	);
}

/** Кебаб-триггер (троеточие) для меню действий в шапке. */
function KebabTrigger({ label }: { label: string }) {
	return (
		<DropdownMenuTrigger asChild>
			<button
				type="button"
				aria-label={label}
				className="flex h-8 w-8 flex-none items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900"
			>
				<MoreVertical size={18} />
			</button>
		</DropdownMenuTrigger>
	);
}

/** Пункт «Показать на карте» — смещает карту к выбранному объекту. */
function FocusMenuItem({ onFocus }: { onFocus: () => void }) {
	return (
		<DropdownMenuItem onSelect={onFocus}>
			<Crosshair size={16} />
			Показать на карте
		</DropdownMenuItem>
	);
}

/** Действия над выбранным бриком в шапке: тоггл редактирования + меню (показать/удалить). */
function BrickHeaderActions({
	editing,
	onToggleEdit,
	onFocus,
	onDelete
}: {
	editing: boolean;
	onToggleEdit: () => void;
	onFocus: () => void;
	onDelete: () => void;
}) {
	return (
		<div className="flex flex-none items-center gap-1">
			<Toggle
				variant="outline"
				size="sm"
				pressed={editing}
				onPressedChange={onToggleEdit}
				aria-label="Редактировать форму брика"
				title="Редактировать форму"
			>
				<Pencil size={16} />
			</Toggle>
			<DropdownMenu>
				<KebabTrigger label="Действия с бриком" />
				<DropdownMenuContent align="end">
					<FocusMenuItem onFocus={onFocus} />
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onSelect={onDelete}
						className="text-red-600 focus:bg-red-50 focus:text-red-700"
					>
						<Trash2 size={16} />
						Удалить брик
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

/** Действия над выбранной точкой в шапке: меню (показать на карте). */
function PointHeaderActions({ onFocus }: { onFocus: () => void }) {
	return (
		<DropdownMenu>
			<KebabTrigger label="Действия с точкой" />
			<DropdownMenuContent align="end">
				<FocusMenuItem onFocus={onFocus} />
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function Overview({ bricks, onSelectBrick }: { bricks: Brick[]; onSelectBrick: (id: string) => void }) {
	return (
		<div className="flex flex-col gap-[22px]">
			<KpiCards stats={GLOBAL_STATS} />
			<TypeComposition stats={GLOBAL_STATS} />

			{/* Брики территории */}
			<div>
				<div className="flex items-center justify-between">
					<div className="text-[13px] font-semibold text-slate-900">Брики территории</div>
					<span className="text-[12px] text-slate-500">{bricks.length} шт.</span>
				</div>
				<div className="mt-[11px] flex flex-col gap-2">
					{bricks.map((b) => (
						<button
							key={b.id}
							type="button"
							onClick={() => onSelectBrick(b.id)}
							className="flex items-center gap-[11px] rounded-[9px] border border-slate-200 bg-white px-[11px] py-2.5 text-left hover:bg-slate-50"
						>
							<span className="h-[26px] w-2.5 flex-none rounded-[3px]" style={{ background: b.color }} />
							<div className="min-w-0 flex-1">
								<div className="text-[13px] font-semibold text-slate-900">{b.name}</div>
								<div className="mt-px text-[12px] text-slate-500">
									{formatMetric(b.stats.count, "Units", "full")} тт ·{" "}
									{formatMetric(b.stats.totalTurnover, "RUB", "compact")}
								</div>
							</div>
							<ChevronRight size={16} className="flex-none text-slate-400" />
						</button>
					))}
				</div>
			</div>
		</div>
	);
}

type RightPanelProps = {
	selection: Selection;
	bricks: Brick[];
	editing: boolean;
	onClose: () => void;
	onSelectBrick: (id: string) => void;
	onDeleteBrick: (id: string) => void;
	onToggleEdit: () => void;
	onFocus: () => void;
};

/** Правая панель: карточка точки / информация о брике / обзор по всей сети ТТ. */
export function RightPanel({
	selection,
	bricks,
	editing,
	onClose,
	onSelectBrick,
	onDeleteBrick,
	onToggleEdit,
	onFocus
}: RightPanelProps) {
	const brick =
		selection?.kind === "brick" ? bricks.find((b) => b.id === selection.id) ?? null : null;
	const point = selection?.kind === "point" ? selection.point : null;

	return (
		<div className="flex h-full flex-col bg-white">
			<div className="px-5 pt-[18px] pb-3.5">
				{point ? (
					<div className="flex items-center gap-2.5">
						<button
							type="button"
							onClick={onClose}
							aria-label="Назад"
							className="flex h-7 w-7 flex-none items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900"
						>
							<ArrowLeft size={18} />
						</button>
						<PointTypeGlyph type={point.type} />
						<div className="min-w-0 flex-1 truncate font-mono text-[18px] font-bold leading-tight tracking-[-.01em] text-slate-900">
							{point.code}
						</div>
						<Badge size="sm" className="flex-none">
							{TYPE_MAP[point.type].label}
						</Badge>
						<PointHeaderActions onFocus={onFocus} />
					</div>
				) : brick ? (
					<div className="flex items-center gap-2.5">
						<button
							type="button"
							onClick={onClose}
							aria-label="Назад"
							className="flex h-7 w-7 flex-none items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900"
						>
							<ArrowLeft size={18} />
						</button>
						<div className="min-w-0 flex-1 truncate text-[20px] font-bold leading-tight tracking-[-.01em] text-slate-900">
							{brick.name}
						</div>
						<Badge size="sm" className="flex-none">
							Брик
						</Badge>
						<BrickHeaderActions
							editing={editing}
							onToggleEdit={onToggleEdit}
							onFocus={onFocus}
							onDelete={() => onDeleteBrick(brick.id)}
						/>
					</div>
				) : (
					<div className="text-[20px] font-bold leading-tight tracking-[-.01em] text-slate-900">
						Все торговые точки
					</div>
				)}
			</div>
			<Divider />

			<div className="flex-1 overflow-y-auto px-5 pt-[18px] pb-7">
				{point ? (
					<PointInfoRows point={point} showDistrict />
				) : brick ? (
					<SelectedBrickView brick={brick} editing={editing} />
				) : (
					<Overview bricks={bricks} onSelectBrick={onSelectBrick} />
				)}
			</div>
		</div>
	);
}
