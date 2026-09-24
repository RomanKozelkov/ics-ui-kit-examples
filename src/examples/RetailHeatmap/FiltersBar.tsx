import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Filter, RotateCcw } from "lucide-react";
import type { SearchSelectOption } from "ics-ui-kit/components/search-select";
import { Counter } from "ics-ui-kit/components/counter";
import { Popover, PopoverContent, PopoverTrigger } from "ics-ui-kit/components/popover";
import { TriggerButton } from "ics-ui-kit/components/button";
import { Icon } from "ics-ui-kit/components/icon";
import { cn } from "ics-ui-kit/lib/utils";
import { MultiSelectControlled } from "../../shared/components/MultiSelectControlled";
import { EmployeeFilter } from "./EmployeeFilter";
import { FilterField } from "../../shared/bi-dashboard/ui/FilterField";
import { CITIES } from "./moscowGeo";
import {
	ALL_VALUES,
	activeDimensionCount,
	setDimension,
	type FilterDimension,
	type FilterState
} from "./filters";
import { CATEGORIES, NETWORK_TYPES, POINT_TYPES, TOP50_VALUES, TOP_LABEL } from "./types";

/**
 * Панель фильтров (раздел 3) — горизонтальная область над картой и правой панелью,
 * доступная всегда (треб. 1.1). Если ширина экрана не позволяет разместить все фильтры
 * в одну строку, панель сворачивается в кнопку «Фильтры» с тем же составом в поп-апе
 * (треб. 3.9); на свёрнутой кнопке видно, сколько фильтров применено и сколько точек
 * показано из общего числа (треб. 3.10).
 */

/** Описание одного фильтра: измерение, подпись и список значений. */
type FilterSpec = {
	dimension: FilterDimension;
	label: string;
	options: SearchSelectOption[];
	/**
	 * Фильтр задаёт рабочую область, а не сужает выборку внутри неё (треб. 3.4).
	 *
	 * Такой фильтр всегда показывает выбранные значения явно и не может остаться пустым:
	 * «все значения» и «выбрано всё» для него — одно и то же состояние. Без этого город
	 * с единственным значением выглядел невыбираемым: полный набор из одного элемента
	 * трактовался как «ничего не выбрано», и галочка у «Москвы» не появлялась.
	 */
	scope?: boolean;
	/** Значения образуют иерархию — фильтр рисуется деревом (`EmployeeFilter`). */
	tree?: boolean;
};

const FILTER_SPECS: FilterSpec[] = [
	{
		dimension: "cities",
		label: "Город",
		options: CITIES.map((c) => ({ value: c.id, label: c.name })),
		scope: true
	},
	{
		dimension: "types",
		label: "Тип торговой точки",
		options: POINT_TYPES.map((t) => ({ value: t.key, label: t.label }))
	},
	{
		dimension: "categories",
		label: "Категория торговой точки",
		options: CATEGORIES.map((c) => ({ value: c, label: c }))
	},
	{ dimension: "top50", label: TOP_LABEL, options: TOP50_VALUES.map((t) => ({ value: t.key, label: t.label })) },
	{
		dimension: "networks",
		label: "Тип сети точки",
		options: NETWORK_TYPES.map((n) => ({ value: n.key, label: n.label }))
	},
	{
		dimension: "employees",
		label: "Сотрудник",
		// Иерархия ASM → DSM → MR: у фильтра свой контрол-дерево, плоский список опций не нужен.
		options: [],
		tree: true
	}
];

/** Мультиселект фильтра: значения статические, поиск фильтрует список локально. */
function FilterSelect({
	spec,
	state,
	onChange
}: {
	spec: FilterSpec;
	state: FilterState;
	onChange: (dimension: FilterDimension, values: string[]) => void;
}) {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");

	const selectedKeys = state[spec.dimension] as string[];
	// Полный набор показываем как «ничего не выбрано»: фильтр не ограничивает выборку.
	// У фильтра рабочей области выбор виден всегда — он не сужает выборку, а задаёт её.
	const showSelection = Boolean(spec.scope) || selectedKeys.length < ALL_VALUES[spec.dimension].length;
	const value = useMemo(
		() => (showSelection ? spec.options.filter((o) => selectedKeys.includes(String(o.value))) : []),
		[showSelection, selectedKeys, spec.options]
	);
	const options = useMemo(() => {
		const q = query.trim().toLowerCase();
		return q ? spec.options.filter((o) => o.label.toLowerCase().includes(q)) : spec.options;
	}, [query, spec.options]);

	return (
		<FilterField label={spec.label}>
			<MultiSelectControlled
				value={value}
				options={options}
				open={open}
				onOpenChange={setOpen}
				onSearch={setQuery}
				onChange={(next) => onChange(spec.dimension, next.map((o) => String(o.value)))}
				placeholder="Все значения"
				// У рабочей области счётчик «Выбрано: 1» не говорит ничего — показываем сам город.
				renderValue={
					spec.scope
						? (selected) => (
								<span className="flex h-6 items-center truncate pl-1.5 text-sm">
									{selected.map((o) => o.label).join(", ")}
								</span>
							)
						: undefined
				}
				clearable={!spec.scope}
			/>
		</FilterField>
	);
}

/** Счётчик показанных точек (треб. 3.8). */
function ShownCounter({ shown, total }: { shown: number; total: number }) {
	return (
		<span className="whitespace-nowrap text-[12px] text-slate-500">
			Показано <span className="font-semibold tabular-nums text-slate-900">{shown}</span> из{" "}
			<span className="tabular-nums">{total}</span>
		</span>
	);
}

function ResetButton({ disabled, onReset }: { disabled: boolean; onReset: () => void }) {
	return (
		<button
			type="button"
			onClick={onReset}
			disabled={disabled}
			className="flex h-10 flex-none items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[13px] font-medium text-slate-700 hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40"
		>
			<RotateCcw size={15} />
			Сбросить
		</button>
	);
}

type FiltersBarProps = {
	filters: FilterState;
	onChange: (next: FilterState) => void;
	onReset: () => void;
	shownCount: number;
	totalCount: number;
};

export function FiltersBar({ filters, onChange, onReset, shownCount, totalCount }: FiltersBarProps) {
	const [open, setOpen] = useState(false);
	const activeCount = activeDimensionCount(filters);

	const handleChange = (dimension: FilterDimension, values: string[]) =>
		onChange(setDimension(filters, dimension, values));

	const fields = FILTER_SPECS.map((spec) =>
		spec.tree ? (
			<FilterField key={spec.dimension} label={spec.label}>
				<EmployeeFilter
					selected={filters[spec.dimension] as string[]}
					total={ALL_VALUES[spec.dimension].length}
					onChange={(ids) => handleChange(spec.dimension, ids)}
				/>
			</FilterField>
		) : (
			<FilterSelect key={spec.dimension} spec={spec} state={filters} onChange={handleChange} />
		)
	);

	return (
		<div className="flex-none border-b border-slate-200 bg-white px-4 py-3">
			{/* Полный ряд фильтров — когда ширины хватает (треб. 1.1). */}
			<div className="hidden items-end gap-3 xl:flex">
				{FILTER_SPECS.map((spec, i) => (
					<div key={spec.dimension} className="min-w-0 flex-1">
						{fields[i]}
					</div>
				))}
				<div className="flex flex-none items-center gap-3 pb-2.5">
					<ShownCounter shown={shownCount} total={totalCount} />
				</div>
				<ResetButton disabled={activeCount === 0} onReset={onReset} />
			</div>

			{/* Свёрнутый вид: кнопка с индикатором применённых фильтров и счётчиком (треб. 3.10). */}
			<div className="flex items-center gap-3 xl:hidden">
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<TriggerButton
							startIcon={Filter}
							className={cn(open ? "bg-secondary-bg-hover shadow-none" : "")}
						>
							Фильтры
							{activeCount > 0 && (
								<Counter variant="secondary" status="default" className="rounded-full tabular-nums">
									{activeCount}
								</Counter>
							)}
							{open ? <Icon icon={ChevronUp} /> : <Icon icon={ChevronDown} />}
						</TriggerButton>
					</PopoverTrigger>
					<PopoverContent
						align="start"
						collisionPadding={16}
						className="z-[900] max-h-[var(--radix-popover-content-available-height)] w-[24rem] overflow-y-auto"
					>
						<div className="flex w-full flex-col gap-4">
							{fields}
							<div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
								<ShownCounter shown={shownCount} total={totalCount} />
								<ResetButton disabled={activeCount === 0} onReset={onReset} />
							</div>
						</div>
					</PopoverContent>
				</Popover>
				<ShownCounter shown={shownCount} total={totalCount} />
			</div>
		</div>
	);
}
