import { useEffect, useRef, useState } from "react";
import {
	ArrowLeft,
	ChevronRight,
	Crosshair,
	MoreVertical,
	Pencil,
	RotateCcw,
	TextCursorInput,
	Trash2
} from "lucide-react";
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
import {
	POPULATION_PENDING_HINT,
	POPULATION_UNAVAILABLE_HINT,
	type TerritoryDemography
} from "./api";
import { PointRows, PointTypeGlyph } from "./PointCard";
import {
	StatRows,
	StatTiles,
	categoryItems,
	employeeItems,
	networkItems,
	top50Items,
	typeItems
} from "./StatBlocks";
import { hasActiveFilters, type FilterDimension, type FilterState } from "./filters";
import type { Stats } from "./stats";
import { POINT_TYPE_MAP, TERRITORY_KIND_LABEL, type Territory, type TradePoint } from "./types";

/** Что выбрано на карте: ничего, территория (округ, район или брик) или точка (треб. 5.1). */
export type Selection =
	| { kind: "territory"; id: string }
	| { kind: "point"; point: TradePoint }
	| null;

/** Строка списка территорий (треб. 5.2.1, пункт 7). */
export type TerritoryListRow = {
	id: string;
	name: string;
	kindLabel: string;
	color: string;
	count: number;
	turnover: number;
};

/* ---------- плитки показателей ---------- */

function Kpi({ label, value, hint, big }: { label: string; value: string; hint?: string; big?: boolean }) {
	// Длинные значения («11,9 млн») в крупном кегле не помещаются в плитку на узкой панели.
	const bigSize = value.length > 6 ? "text-[17px]" : "text-[21px]";
	return (
		<div className="min-w-0 rounded-[10px] border border-slate-200 px-2.5 py-[11px]" title={hint}>
			<div className="truncate text-[11px] text-slate-500">{label}</div>
			<div
				className={
					(big ? `mt-[3px] ${bigSize}` : "mt-[5px] text-[15px]") +
					" truncate font-bold tabular-nums tracking-[-.01em] text-slate-900"
				}
			>
				{value}
			</div>
		</div>
	);
}

/** Пять показателей территории или всей рабочей области (треб. 5.2.1 и 5.3.2, пункт 1). */
function KpiCards({ stats, demography }: { stats: Stats; demography: TerritoryDemography }) {
	const populationKnown = demography.population !== null;
	// Почему населения нет: у черновика оно ещё не считалось, у нарезанного брика — неизвестно.
	const populationNote =
		demography.source === "pending" ? POPULATION_PENDING_HINT : POPULATION_UNAVAILABLE_HINT;
	return (
		<div className="flex flex-col gap-[9px]">
			{/* Плитки переносятся на вторую строку, когда панель сужена до минимальных 24 %. */}
			<div className="grid grid-cols-[repeat(auto-fit,minmax(96px,1fr))] gap-[9px]">
				<Kpi label="Точек" value={formatMetric(stats.count, "Units", "full")} big />
				<Kpi label="Больниц" value={formatMetric(demography.hospitals, "Units", "full")} big />
				{/*
				 * Население — единственный показатель в семь знаков: в полном формате он не
				 * помещается в плитку на минимальной ширине панели (24 %), поэтому выводится
				 * коротко, а точное значение остаётся в подсказке.
				 */}
				<Kpi
					label="Население"
					value={populationKnown ? formatMetric(demography.population as number, "Units", "compact") : "—"}
					hint={
						populationKnown
							? formatMetric(demography.population as number, "Units", "full")
							: populationNote
					}
					big
				/>
			</div>
			<div className="grid grid-cols-2 gap-[9px]">
				<Kpi label="Σ mAVG offtake" value={formatMetric(stats.offtake, "RUB", "compact")} />
				<Kpi label="Σ mAVG turnover" value={formatMetric(stats.turnover, "RUB", "compact")} />
			</div>
			{!populationKnown && (
				<div className="rounded-[10px] border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] leading-snug text-slate-600">
					{populationNote}
				</div>
			)}
		</div>
	);
}

/* ---------- блоки статистики ---------- */

type StatSectionProps = {
	stats: Stats;
	filters: FilterState;
	onToggleFilter: (dimension: FilterDimension, value: string) => void;
};

/** Блоки 2–6: состав по типам, категории, ТОП-50 %, типы сети, сотрудники. */
function StatSections({ stats, filters, onToggleFilter }: StatSectionProps) {
	return (
		<>
			<StatRows
				title="Состав по типам"
				dimension="types"
				items={typeItems(stats)}
				filters={filters}
				onToggle={onToggleFilter}
			/>
			<StatTiles
				title="Категории точек"
				dimension="categories"
				items={categoryItems(stats)}
				filters={filters}
				onToggle={onToggleFilter}
			/>
			<StatTiles
				title="ТОП-50 %"
				dimension="top50"
				items={top50Items(stats)}
				filters={filters}
				onToggle={onToggleFilter}
			/>
			<StatRows
				title="Типы сети"
				dimension="networks"
				items={networkItems(stats)}
				filters={filters}
				onToggle={onToggleFilter}
			/>
			<StatRows
				title="Сотрудники"
				dimension="employees"
				items={employeeItems(stats)}
				filters={filters}
				onToggle={onToggleFilter}
				collapseAfter={8}
			/>
		</>
	);
}

/* ---------- список территорий ---------- */

function TerritoryList({
	rows,
	onSelect
}: {
	rows: TerritoryListRow[];
	onSelect: (id: string) => void;
}) {
	return (
		<div>
			<div className="flex items-center justify-between">
				<div className="text-[13px] font-semibold text-slate-900">Территории</div>
				<span className="text-[12px] text-slate-500">{rows.length} шт.</span>
			</div>
			<div className="mt-[11px] flex flex-col gap-2">
				{rows.map((row) => (
					<button
						key={row.id}
						type="button"
						onClick={() => onSelect(row.id)}
						className="flex items-center gap-[11px] rounded-[9px] border border-slate-200 bg-white px-[11px] py-2.5 text-left hover:bg-slate-50"
					>
						<span className="h-[26px] w-2.5 flex-none rounded-[3px]" style={{ background: row.color }} />
						<div className="min-w-0 flex-1">
							<div className="flex items-center gap-1.5">
								<span className="truncate text-[13px] font-semibold text-slate-900">{row.name}</span>
								<span className="flex-none rounded bg-slate-100 px-1.5 text-[10px] text-slate-500">
									{row.kindLabel}
								</span>
							</div>
							<div className="mt-px text-[12px] text-slate-500">
								{formatMetric(row.count, "Units", "full")} тт ·{" "}
								{formatMetric(row.turnover, "RUB", "compact")}
							</div>
						</div>
						<ChevronRight size={16} className="flex-none text-slate-400" />
					</button>
				))}
			</div>
		</div>
	);
}

/* ---------- шапка ---------- */

function BackButton({ onClick }: { onClick: () => void }) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-label="Назад"
			className="flex h-7 w-7 flex-none items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900"
		>
			<ArrowLeft size={18} />
		</button>
	);
}

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

function FocusMenuItem({ onFocus }: { onFocus: () => void }) {
	return (
		<DropdownMenuItem onSelect={onFocus}>
			<Crosshair size={16} />
			Показать на карте
		</DropdownMenuItem>
	);
}

/** Действия над выбранной территорией (треб. 5.3.1). Правка и удаление — только у брика. */
function TerritoryHeaderActions({
	territory,
	editing,
	onToggleEdit,
	onFocus,
	onRename,
	onDelete
}: {
	territory: Territory;
	editing: boolean;
	onToggleEdit: () => void;
	onFocus: () => void;
	onRename: () => void;
	onDelete: () => void;
}) {
	const isBrick = territory.kind === "brick";
	// Закрываясь, меню возвращает фокус на свою кнопку — и забирает его у поля ввода имени,
	// из-за чего режим переименования закрывался сразу же. Для этого пункта возврат отключаем.
	const keepFocus = useRef(false);
	return (
		<div className="flex flex-none items-center gap-1">
			{isBrick && (
				<Toggle
					variant="outline"
					size="sm"
					pressed={editing}
					onPressedChange={onToggleEdit}
					aria-label="Изменить границы брика"
					title="Изменить границы"
				>
					<Pencil size={16} />
				</Toggle>
			)}
			<DropdownMenu>
				<KebabTrigger label="Действия с территорией" />
				<DropdownMenuContent
					align="end"
					onCloseAutoFocus={(event) => {
						if (!keepFocus.current) return;
						keepFocus.current = false;
						event.preventDefault();
					}}
				>
					<FocusMenuItem onFocus={onFocus} />
					{isBrick && (
						<>
							<DropdownMenuItem
								onSelect={() => {
									keepFocus.current = true;
									onRename();
								}}
							>
								<TextCursorInput size={16} />
								Переименовать
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onSelect={onDelete}
								className="text-red-600 focus:bg-red-50 focus:text-red-700"
							>
								<Trash2 size={16} />
								Удалить брик
							</DropdownMenuItem>
						</>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

/**
 * Название территории. У брика оно правится по месту — из меню «Переименовать» или двойным
 * кликом по названию; у округа и района название из справочника и не меняется.
 */
function TerritoryTitle({
	territory,
	renaming,
	onStartRename,
	onRename,
	onCancel
}: {
	territory: Territory;
	renaming: boolean;
	onStartRename: () => void;
	onRename: (name: string) => void;
	onCancel: () => void;
}) {
	const inputRef = useRef<HTMLInputElement>(null);
	// Enter и Escape уже решили судьбу имени — следующий blur не должен применить его повторно.
	// Поле при этом размонтируется, blur может и не прийти, поэтому флаг сбрасывается на старте.
	const skipBlur = useRef(false);
	// Пункт меню возвращает фокус на свою кнопку при закрытии — забираем его после этого.
	useEffect(() => {
		if (!renaming) return;
		skipBlur.current = false;
		const timer = window.setTimeout(() => {
			inputRef.current?.focus();
			inputRef.current?.select();
		}, 0);
		return () => window.clearTimeout(timer);
	}, [renaming]);

	const titleClass = "min-w-0 flex-1 truncate text-[20px] font-bold leading-tight tracking-[-.01em] text-slate-900";
	const isBrick = territory.kind === "brick";

	if (!renaming) {
		return (
			<div
				className={isBrick ? `${titleClass} cursor-text` : titleClass}
				onDoubleClick={isBrick ? onStartRename : undefined}
				title={isBrick ? "Двойной клик — переименовать" : undefined}
			>
				{territory.name}
			</div>
		);
	}

	const commit = (value: string) => {
		const name = value.trim();
		if (name && name !== territory.name) onRename(name);
		else onCancel();
	};

	return (
		<input
			ref={inputRef}
			defaultValue={territory.name}
			aria-label="Название брика"
			maxLength={60}
			className={`${titleClass} rounded-md border border-slate-300 bg-white px-1.5 py-0.5 outline-none focus:border-slate-900`}
			onKeyDown={(event) => {
				if (event.key === "Enter") {
					skipBlur.current = true;
					commit(event.currentTarget.value);
				} else if (event.key === "Escape") {
					skipBlur.current = true;
					onCancel();
				}
			}}
			onBlur={(event) => {
				if (skipBlur.current) {
					skipBlur.current = false;
					return;
				}
				commit(event.currentTarget.value);
			}}
		/>
	);
}

/* ---------- черновик брика ---------- */

/**
 * Состояние панели во время рисования (треб. 5.1 — четвёртое состояние сверх трёх основных).
 *
 * Пока инструмент активен, панель показывает не выбранную территорию, а ту, что получится.
 * `stats` есть только у замкнутой области: у лассо до отпускания кнопки и у разреза контур
 * ещё не собран, считать по нему нечего — тогда выводится одно название.
 */
export type DraftTerritory = {
	title: string;
	stats: Stats | null;
	demography: TerritoryDemography | null;
	hint: string;
};

/* ---------- панель ---------- */

type RightPanelProps = {
	selection: Selection;
	/** Статистика текущей области: вся рабочая область или выбранная территория. */
	stats: Stats;
	demography: TerritoryDemography;
	/** Фильтры, действующие в текущей области — по ним подсвечиваются значения (треб. 5.5.6). */
	scopeFilters: FilterState;
	/** true, когда фильтр действует только в границах территории (треб. 5.5.2). */
	scopeIsLocal: boolean;
	territory: Territory | null;
	/** Черновик брика во время рисования — перекрывает обычное состояние панели. */
	draft: DraftTerritory | null;
	territoryRows: TerritoryListRow[];
	editing: boolean;
	onToggleFilter: (dimension: FilterDimension, value: string) => void;
	onResetScopeFilters: () => void;
	onClose: () => void;
	onSelectTerritory: (id: string) => void;
	onRenameBrick: (id: string, name: string) => void;
	onDeleteBrick: (id: string) => void;
	onToggleEdit: () => void;
	onFocus: () => void;
};

export function RightPanel({
	selection,
	stats,
	demography,
	scopeFilters,
	scopeIsLocal,
	territory,
	draft,
	territoryRows,
	editing,
	onToggleFilter,
	onResetScopeFilters,
	onClose,
	onSelectTerritory,
	onRenameBrick,
	onDeleteBrick,
	onToggleEdit,
	onFocus
}: RightPanelProps) {
	const point = selection?.kind === "point" ? selection.point : null;
	const localFilterActive = scopeIsLocal && hasActiveFilters(scopeFilters);
	const [renaming, setRenaming] = useState(false);
	// Переключились на другую территорию — незавершённое переименование закрывается.
	useEffect(() => setRenaming(false), [territory?.id]);

	return (
		<div className="flex h-full flex-col bg-white">
			<div className="px-5 pb-3.5 pt-[18px]">
				{draft ? (
					<div className="flex items-center gap-2.5">
						<div className="min-w-0 flex-1 truncate text-[20px] font-bold leading-tight tracking-[-.01em] text-slate-900">
							{draft.title}
						</div>
						<Badge size="sm" focus="low" className="flex-none">
							Черновик
						</Badge>
					</div>
				) : point ? (
					<div className="flex items-center gap-2.5">
						<BackButton onClick={onClose} />
						<PointTypeGlyph type={point.type} />
						<div className="min-w-0 flex-1 truncate font-mono text-[18px] font-bold leading-tight tracking-[-.01em] text-slate-900">
							{point.code}
						</div>
						<Badge size="sm" className="flex-none">
							{POINT_TYPE_MAP[point.type].label}
						</Badge>
						<DropdownMenu>
							<KebabTrigger label="Действия с точкой" />
							<DropdownMenuContent align="end">
								<FocusMenuItem onFocus={onFocus} />
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				) : territory ? (
					<div className="flex items-center gap-2.5">
						<BackButton onClick={onClose} />
						<TerritoryTitle
							territory={territory}
							renaming={renaming}
							onStartRename={() => setRenaming(true)}
							onRename={(name) => {
								setRenaming(false);
								onRenameBrick(territory.id, name);
							}}
							onCancel={() => setRenaming(false)}
						/>
						<Badge size="sm" className="flex-none">
							{TERRITORY_KIND_LABEL[territory.kind]}
						</Badge>
						<TerritoryHeaderActions
							territory={territory}
							editing={editing}
							onToggleEdit={onToggleEdit}
							onFocus={onFocus}
							onRename={() => setRenaming(true)}
							onDelete={() => onDeleteBrick(territory.id)}
						/>
					</div>
				) : (
					<div className="text-[20px] font-bold leading-tight tracking-[-.01em] text-slate-900">
						Все торговые точки
					</div>
				)}
			</div>
			<Divider />

			<div className="flex-1 overflow-y-auto px-5 pb-7 pt-[18px]">
				{draft ? (
					<div className="flex flex-col gap-[22px]">
						<div className="rounded-[10px] border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[12px] leading-snug text-slate-600">
							{draft.hint}
						</div>
						{draft.stats && draft.demography && (
							<>
								<KpiCards stats={draft.stats} demography={draft.demography} />
								<StatSections
									stats={draft.stats}
									filters={scopeFilters}
									onToggleFilter={onToggleFilter}
								/>
							</>
						)}
					</div>
				) : point ? (
					<PointRows point={point} />
				) : (
					<div className="flex flex-col gap-[22px]">
						{editing && territory?.kind === "brick" && (
							<div className="rounded-[10px] border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-[12px] text-slate-600">
								Перетаскивайте точки на границе брика, чтобы изменить форму. Клик по средней точке
								добавляет вершину, правый клик по вершине удаляет её.
							</div>
						)}
						{localFilterActive && (
							<div className="flex items-center gap-2 rounded-[10px] border border-slate-900 bg-slate-50 px-3 py-2 text-[12px] text-slate-700">
								<span className="flex-1">Фильтр действует только в границах территории</span>
								<button
									type="button"
									onClick={onResetScopeFilters}
									title="Снять фильтр территории"
									aria-label="Снять фильтр территории"
									className="flex h-6 w-6 flex-none items-center justify-center rounded-md text-slate-500 hover:bg-white hover:text-slate-900"
								>
									<RotateCcw size={14} />
								</button>
							</div>
						)}
						<KpiCards stats={stats} demography={demography} />
						<StatSections stats={stats} filters={scopeFilters} onToggleFilter={onToggleFilter} />
						{!territory && <TerritoryList rows={territoryRows} onSelect={onSelectTerritory} />}
					</div>
				)}
			</div>
		</div>
	);
}
