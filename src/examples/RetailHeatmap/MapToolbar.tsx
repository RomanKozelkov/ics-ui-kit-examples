import { useRef, useState } from "react";
import { Combine, Info, Scissors, Undo2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "ics-ui-kit/components/popover";
import { CursorIcon } from "./toolIcons";
import { SelectionTips } from "./SelectionTips";

/**
 * Инструменты карты: выбор, разрез и объединение (треб. 2.3).
 *
 * Прямоугольник, лассо и полигон убраны по итогам показа прототипа: брик не рисуется с нуля,
 * а получается из существующих территорий — разрезом или объединением — и дальше правится
 * по вершинам.
 */
export type Tool = "cursor" | "cut" | "merge";

const TOOLS: { key: Tool; title: string; icon: React.ReactNode }[] = [
	{ key: "cursor", title: "Курсор — выбор территории и точки", icon: <CursorIcon size={18} /> },
	{ key: "cut", title: "Разрез — разделить территорию линией", icon: <Scissors size={18} /> },
	{ key: "merge", title: "Объединение — собрать брик из территорий", icon: <Combine size={18} /> }
];

const BTN_BASE = "flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ";
const BTN_INACTIVE = "border-slate-200 bg-white text-slate-700 hover:bg-slate-50";

/** Info-кнопка тулбара: по наведению — поповер с подсказкой. */
function InfoButton() {
	const [open, setOpen] = useState(false);
	const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const show = () => {
		if (closeTimer.current) clearTimeout(closeTimer.current);
		setOpen(true);
	};
	const hide = () => {
		if (closeTimer.current) clearTimeout(closeTimer.current);
		closeTimer.current = setTimeout(() => setOpen(false), 120);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<button
					type="button"
					aria-label="Как нарезать территорию"
					onMouseEnter={show}
					onMouseLeave={hide}
					onFocus={show}
					onBlur={hide}
					className={BTN_BASE + BTN_INACTIVE}
				>
					<Info size={18} />
				</button>
			</PopoverTrigger>
			<PopoverContent
				side="right"
				align="start"
				sideOffset={10}
				onOpenAutoFocus={(e) => e.preventDefault()}
				onMouseEnter={show}
				onMouseLeave={hide}
				className="z-[600] w-[280px]"
			>
				<SelectionTips />
			</PopoverContent>
		</Popover>
	);
}

/** Плавающий тулбар нарезки слева над картой. */
export function MapToolbar({
	tool,
	onToolChange,
	canUndo,
	onUndo
}: {
	tool: Tool;
	onToolChange: (tool: Tool) => void;
	canUndo: boolean;
	onUndo: () => void;
}) {
	return (
		<div className="absolute left-3.5 top-3.5 z-[500] flex flex-col gap-1.5 rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_2px_4px_-2px_rgba(15,23,42,.12),0_4px_8px_-1px_rgba(15,23,42,.12)]">
			{TOOLS.map((item) => {
				const active = tool === item.key;
				return (
					<button
						key={item.key}
						type="button"
						title={item.title}
						aria-pressed={active}
						onClick={() => onToolChange(item.key)}
						className={
							BTN_BASE + (active ? "border-slate-900 bg-slate-900 text-white" : BTN_INACTIVE)
						}
					>
						{item.icon}
					</button>
				);
			})}
			<div className="my-0.5 h-px bg-slate-200" />
			<button
				type="button"
				title="Отменить последнее действие нарезки"
				aria-label="Отменить последнее действие нарезки"
				disabled={!canUndo}
				onClick={onUndo}
				className={BTN_BASE + BTN_INACTIVE + " disabled:pointer-events-none disabled:opacity-40"}
			>
				<Undo2 size={18} />
			</button>
			<InfoButton />
		</div>
	);
}
