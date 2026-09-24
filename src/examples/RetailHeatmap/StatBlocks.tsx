import { formatMetric } from "../../shared/bi-dashboard/format";
import { EMPLOYEES } from "./mockData";
import { isValueSelected, type FilterDimension, type FilterState } from "./filters";
import type { Stats, Volume } from "./stats";
import { CATEGORIES, NETWORK_TYPES, POINT_TYPES, TOP50_VALUES, catColor, type Employee } from "./types";

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
	/** Объём группы — для блоков, где рядом с количеством нужен offtake и turnover. */
	volume?: Volume;
};

type BlockProps = {
	title: string;
	dimension: FilterDimension;
	items: StatItem[];
	filters: FilterState;
	onToggle: (dimension: FilterDimension, value: string) => void;
};

const ROW_BASE =
	"flex w-full items-center gap-2 rounded-[8px] border px-2 py-[7px] text-left transition-colors";
const IDLE = "border-slate-200 bg-white hover:bg-slate-50";
const SELECTED = "border-slate-900 bg-slate-50 ring-1 ring-slate-900";

function BlockTitle({ children }: { children: React.ReactNode }) {
	return <div className="mb-2.5 text-[13px] font-semibold text-slate-900">{children}</div>;
}

/** Сетка строк с объёмами: значение, точек, Σ offtake, Σ turnover. */
const VOLUME_GRID = "grid grid-cols-[minmax(0,1fr)_40px_68px_68px] gap-2";

/**
 * Строки с объёмами: значение, количество точек, Σ offtake и Σ turnover (категории, топ точки).
 * Плитки для этого узки — на минимальной ширине панели в них не помещаются две суммы.
 */
export function StatVolumeRows({ title, dimension, items, filters, onToggle }: BlockProps) {
	const money = (value: number) => formatMetric(value, "RUB", "compact");
	return (
		<div>
			<BlockTitle>{title}</BlockTitle>
			<div
				className={`${VOLUME_GRID} mb-1 px-2 text-[10px] font-medium uppercase tracking-wide text-slate-400`}
			>
				<span />
				<span className="text-right">Точек</span>
				<span className="text-right">Offtake</span>
				<span className="text-right">Turnover</span>
			</div>
			<div className="flex flex-col gap-[5px]">
				{items.map((item) => {
					const selected = isValueSelected(filters, dimension, item.key);
					return (
						<button
							key={item.key}
							type="button"
							onClick={() => onToggle(dimension, item.key)}
							aria-pressed={selected}
							className={`${VOLUME_GRID} w-full items-center rounded-[8px] border px-2 py-[7px] text-left text-[12px] tabular-nums transition-colors ${selected ? SELECTED : IDLE}`}
						>
							<span className="flex min-w-0 items-center gap-1.5">
								{item.color && (
									<span className="h-[9px] w-[9px] flex-none rounded-full" style={{ background: item.color }} />
								)}
								<span className="truncate font-semibold text-slate-900">{item.label}</span>
							</span>
							<span className="text-right font-semibold text-slate-900">{item.count}</span>
							<span className="truncate text-right text-slate-600">{money(item.volume?.offtake ?? 0)}</span>
							<span className="truncate text-right text-slate-600">{money(item.volume?.turnover ?? 0)}</span>
						</button>
					);
				})}
			</div>
		</div>
	);
}

/** Раскладка строками — для длинных подписей (типы точек, типы сети). */
export function StatRows({ title, dimension, items, filters, onToggle }: BlockProps) {
	return (
		<div>
			<BlockTitle>{title}</BlockTitle>
			<div className="flex flex-col gap-[5px]">
				{items.map((item) => {
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
								<span className="h-[9px] w-[9px] flex-none rounded-full" style={{ background: item.color }} />
							)}
							<span className="min-w-0 flex-1 truncate text-[12px] text-slate-700">{item.label}</span>
							<span className="flex-none text-[12px] font-semibold tabular-nums text-slate-900">
								{formatMetric(item.count, "Units", "full")}
							</span>
						</button>
					);
				})}
			</div>
		</div>
	);
}

/* ---------- сборка значений блоков ---------- */

export const typeItems = (stats: Stats): StatItem[] =>
	POINT_TYPES.map((t) => ({ key: t.key, label: t.label, count: stats.byType[t.key] ?? 0, color: t.color }));

export const categoryItems = (stats: Stats): StatItem[] => {
	// Категории из справочника плюс встретившиеся в данных значения вне его.
	const keys = [...CATEGORIES, ...Object.keys(stats.byCategory).filter((k) => !CATEGORIES.includes(k))];
	return keys.map((key) => ({
		key,
		label: key,
		count: stats.byCategory[key] ?? 0,
		color: catColor(key),
		volume: stats.categoryVolume[key]
	}));
};

export const top50Items = (stats: Stats): StatItem[] =>
	TOP50_VALUES.map((t) => ({
		key: t.key,
		label: t.label,
		count: stats.byTop50[t.key] ?? 0,
		volume: stats.top50Volume[t.key]
	}));

export const networkItems = (stats: Stats): StatItem[] =>
	NETWORK_TYPES.map((n) => ({ key: n.key, label: n.label, count: stats.byNetwork[n.key] ?? 0 }));

/* ---------- сотрудники ---------- */

/** Команда DSM в выбранной области: его ASM и медпредставители с точками в области. */
type EmployeeGroup = { asm: Employee | undefined; dsm: Employee; mrs: Employee[] };

/**
 * Сотрудники всех уровней, у которых в области есть точки. Порядок — по ASM, внутри —
 * по числу точек, чтобы крупные команды были наверху.
 */
function employeeGroups(stats: Stats): EmployeeGroup[] {
	const count = (e: Employee) => stats.byEmployee[e.id] ?? 0;
	const byCount = (a: Employee, b: Employee) => count(b) - count(a) || a.name.localeCompare(b.name);
	const asmName = (e?: Employee) => e?.name ?? "";
	return EMPLOYEES.filter((e) => e.role === "DSM" && count(e) > 0)
		.map((dsm) => ({
			asm: EMPLOYEES.find((e) => e.id === dsm.parentId),
			dsm,
			mrs: EMPLOYEES.filter((e) => e.parentId === dsm.id && count(e) > 0).sort(byCount)
		}))
		.sort((a, b) => asmName(a.asm).localeCompare(asmName(b.asm)) || byCount(a.dsm, b.dsm));
}

/**
 * Блок «Сотрудники» (треб. 5.3.2, пункт 6) — компактная иерархия по пожеланию заказчика:
 * ASM и DSM в одной строке, под ней медпредставители этой команды; у каждого — только число
 * точек. Выводятся все, у кого в выбранной области есть точки. Любое имя кликабельно и
 * работает как фильтр (треб. 5.5).
 */
export function EmployeeStats({
	stats,
	filters,
	onToggle
}: {
	stats: Stats;
	filters: FilterState;
	onToggle: (dimension: FilterDimension, value: string) => void;
}) {
	const groups = employeeGroups(stats);

	const person = (employee: Employee, variant: "head" | "chip") => {
		const selected = isValueSelected(filters, "employees", employee.id);
		const count = stats.byEmployee[employee.id] ?? 0;
		const tone = selected ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100";
		const frame = variant === "chip" ? " border border-slate-200" : "";
		return (
			<button
				key={employee.id}
				type="button"
				onClick={() => onToggle("employees", employee.id)}
				aria-pressed={selected}
				title={`${employee.name} · ${employee.role}`}
				className={`inline-flex min-w-0 items-center gap-1 rounded-md px-1.5 py-[3px] text-[12px] transition-colors ${tone}${frame}`}
			>
				{variant === "head" && (
					<span className={`text-[10px] font-semibold ${selected ? "text-slate-300" : "text-slate-400"}`}>
						{employee.role}
					</span>
				)}
				<span className="truncate">{employee.name}</span>
				<span className={`flex-none font-semibold tabular-nums ${selected ? "text-white" : "text-slate-900"}`}>
					{count}
				</span>
			</button>
		);
	};

	return (
		<div>
			<BlockTitle>Сотрудники</BlockTitle>
			{groups.length ? (
				<div className="flex flex-col gap-[7px]">
					{groups.map(({ asm, dsm, mrs }) => (
						<div key={dsm.id} className="rounded-[8px] border border-slate-200 p-1.5">
							<div className="flex min-w-0 items-center gap-0.5">
								{asm && person(asm, "head")}
								<span className="flex-none text-[12px] text-slate-300">›</span>
								{person(dsm, "head")}
							</div>
							{mrs.length > 0 && (
								<div className="mt-1 flex flex-wrap gap-1 pl-1">{mrs.map((mr) => person(mr, "chip"))}</div>
							)}
						</div>
					))}
				</div>
			) : (
				<div className="text-[12px] text-slate-500">В области нет точек</div>
			)}
		</div>
	);
}
