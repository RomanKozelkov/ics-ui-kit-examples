import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Search } from "lucide-react";
import { Popover, PopoverTrigger } from "ics-ui-kit/components/popover";
import { Checkbox } from "ics-ui-kit/components/checkbox";
import { Counter } from "ics-ui-kit/components/counter";
import { SearchSelectContent, SearchSelectTrigger } from "ics-ui-kit/components/search-select";
import { EMPLOYEES, EMPLOYEE_MAP } from "./mockData";
import type { Employee, EmployeeRole } from "./types";

/**
 * Фильтр по сотруднику (треб. 3.6) — дерево ASM → DSM → MR со сворачиванием ветвей и
 * выбором ветви целиком.
 *
 * Обычный мультиселект здесь не годится: плоский список из сорока восьми человек не
 * показывает, кто кому подчиняется, и не даёт выбрать всю команду одним кликом. Готового
 * дерева-мультиселекта в ics-ui-kit нет, поэтому оболочка (триггер, поповер) взята из
 * `search-select`, а тело списка своё.
 *
 * Выбор хранится плоским списком идентификаторов — тем же, что у остальных фильтров: выбор
 * руководителя добавляет в него и всех подчинённых, поэтому проверка точки остаётся прежней
 * (цепочка MR → DSM → ASM пересекается с выбранными).
 */

type TreeNode = { employee: Employee; children: TreeNode[] };

function buildTree(): TreeNode[] {
	const nodes = new Map<string, TreeNode>(
		EMPLOYEES.map((employee) => [employee.id, { employee, children: [] }])
	);
	const roots: TreeNode[] = [];
	for (const node of nodes.values()) {
		const parent = node.employee.parentId ? nodes.get(node.employee.parentId) : undefined;
		if (parent) parent.children.push(node);
		else roots.push(node);
	}
	const byName = (a: TreeNode, b: TreeNode) => a.employee.name.localeCompare(b.employee.name);
	const sort = (list: TreeNode[]) => {
		list.sort(byName);
		for (const node of list) sort(node.children);
	};
	sort(roots);
	return roots;
}

const TREE: TreeNode[] = buildTree();

/** Идентификаторы всей ветви, включая её корень. */
function branchIds(node: TreeNode, into: string[] = []): string[] {
	into.push(node.employee.id);
	for (const child of node.children) branchIds(child, into);
	return into;
}

const BRANCH_IDS: Record<string, string[]> = Object.fromEntries(
	EMPLOYEES.map((employee) => {
		const find = (list: TreeNode[]): TreeNode | undefined => {
			for (const node of list) {
				if (node.employee.id === employee.id) return node;
				const found = find(node.children);
				if (found) return found;
			}
			return undefined;
		};
		const node = find(TREE);
		return [employee.id, node ? branchIds(node) : [employee.id]];
	})
);

type CheckState = "on" | "off" | "partial";

/** Состояние флажка ветви: выбрана целиком, частично или не выбрана. */
function checkState(node: TreeNode, selected: Set<string>): CheckState {
	const ids = BRANCH_IDS[node.employee.id];
	const chosen = ids.filter((id) => selected.has(id)).length;
	if (!chosen) return "off";
	return chosen === ids.length ? "on" : "partial";
}

/**
 * Приводит выбор в согласованное состояние: руководитель отмечен ровно тогда, когда отмечены
 * все его подчинённые. Иначе флажок ветви после клика по последнему подчинённому остался бы
 * частичным, хотя выбраны все.
 */
function reconcile(selected: Set<string>): Set<string> {
	const walk = (node: TreeNode): boolean => {
		if (!node.children.length) return selected.has(node.employee.id);
		const all = node.children.map(walk).every(Boolean);
		if (all) selected.add(node.employee.id);
		else selected.delete(node.employee.id);
		return all;
	};
	for (const root of TREE) walk(root);
	return selected;
}

/** Выбранные узлы, у которых не выбран родитель, — по ним подписывается триггер. */
function selectionRoots(selected: string[]): string[] {
	const set = new Set(selected);
	return selected.filter((id) => {
		const parentId = EMPLOYEE_MAP[id]?.parentId;
		return !parentId || !set.has(parentId);
	});
}

const ROLE_HINT: Record<EmployeeRole, string> = {
	ASM: "ASM",
	DSM: "DSM",
	MR: "MR"
};

export function EmployeeFilter({
	selected,
	total,
	onChange
}: {
	/** Выбранные идентификаторы сотрудников любого уровня. */
	selected: string[];
	/** Сколько всего сотрудников: полный выбор равнозначен «фильтр не применён». */
	total: number;
	onChange: (ids: string[]) => void;
}) {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [expanded, setExpanded] = useState<Set<string>>(new Set());

	// Полный набор показываем как «ничего не выбрано» — так же, как в остальных фильтрах.
	const restricted = selected.length < total;
	const selectedSet = useMemo(() => new Set(restricted ? selected : []), [restricted, selected]);

	// Поиск оставляет сотрудника вместе с его руководителями, чтобы ветвь не разрывалась.
	const matches = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return null;
		const found = new Set<string>();
		const walk = (node: TreeNode): boolean => {
			const hit = node.employee.name.toLowerCase().includes(q);
			const childHit = node.children.map(walk).some(Boolean);
			if (hit || childHit) found.add(node.employee.id);
			return hit || childHit;
		};
		for (const root of TREE) walk(root);
		return found;
	}, [query]);

	const toggle = (node: TreeNode) => {
		const next = new Set(selectedSet);
		const ids = BRANCH_IDS[node.employee.id];
		if (checkState(node, selectedSet) === "on") ids.forEach((id) => next.delete(id));
		else ids.forEach((id) => next.add(id));
		onChange([...reconcile(next)]);
	};

	const toggleExpanded = (id: string) =>
		setExpanded((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});

	const renderNode = (node: TreeNode, level: number) => {
		const { id, name, role } = node.employee;
		if (matches && !matches.has(id)) return null;
		const state = checkState(node, selectedSet);
		// При поиске ветви раскрыты, чтобы найденное было видно без лишних кликов.
		const isOpen = matches ? true : expanded.has(id);
		return (
			<div key={id}>
				<div
					className="flex items-center gap-1.5 rounded-md py-1 pr-2 hover:bg-slate-50"
					style={{ paddingLeft: 4 + level * 18 }}
				>
					{node.children.length ? (
						<button
							type="button"
							onClick={() => toggleExpanded(id)}
							aria-label={isOpen ? "Свернуть" : "Развернуть"}
							aria-expanded={isOpen}
							className="flex h-5 w-5 flex-none items-center justify-center rounded text-slate-400 hover:bg-slate-200 hover:text-slate-700"
						>
							{isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
						</button>
					) : (
						<span className="h-5 w-5 flex-none" />
					)}
					<label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2">
						<Checkbox
							size="sm"
							checked={state === "partial" ? "indeterminate" : state === "on"}
							onCheckedChange={() => toggle(node)}
							aria-label={`${name} · ${role}`}
						/>
						<span className="min-w-0 flex-1 truncate text-sm text-slate-900">{name}</span>
						<span className="flex-none text-[10px] font-semibold uppercase text-slate-400">
							{ROLE_HINT[role]}
						</span>
					</label>
				</div>
				{isOpen && node.children.map((child) => renderNode(child, level + 1))}
			</div>
		);
	};

	const roots = selectionRoots([...selectedSet]);
	const triggerLabel =
		roots.length === 1 ? EMPLOYEE_MAP[roots[0]]?.name : roots.length ? String(roots.length) : "";

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<SearchSelectTrigger
					open={open}
					placeholder="Все значения"
					onClear={selectedSet.size ? () => onChange([]) : undefined}
				>
					{selectedSet.size ? (
						<div className="flex h-6 min-w-0 items-center gap-1 pl-1.5 text-sm">
							{roots.length === 1 ? (
								<span className="truncate">{triggerLabel}</span>
							) : (
								<>
									<span>Выбрано:</span>
									<Counter variant="secondary" status="default" className="rounded-full tabular-nums">
										{triggerLabel}
									</Counter>
								</>
							)}
						</div>
					) : undefined}
				</SearchSelectTrigger>
			</PopoverTrigger>
			<SearchSelectContent>
				<div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2">
					<Search size={15} className="flex-none text-slate-400" />
					<input
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder="Найти"
						aria-label="Поиск сотрудника"
						className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-hidden placeholder:text-slate-400"
					/>
				</div>
				<div className="max-h-[320px] overflow-y-auto p-1">
					{TREE.map((root) => renderNode(root, 0))}
					{matches && !matches.size && (
						<div className="px-3 py-6 text-center text-sm text-slate-500">Результатов не найдено</div>
					)}
				</div>
			</SearchSelectContent>
		</Popover>
	);
}
