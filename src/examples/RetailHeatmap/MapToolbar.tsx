import { useRef, useState } from "react";
import { Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "ics-ui-kit/components/popover";
import { CursorIcon, LassoIcon, PolygonIcon, SquareIcon } from "./toolIcons";
import { SelectionTips } from "./SelectionTips";

export type Tool = "cursor" | "square" | "lasso" | "polygon";

const TOOLS: { key: Tool; title: string; icon: React.ReactNode }[] = [
	{ key: "cursor", title: "Курсор — выбор точки и брика", icon: <CursorIcon size={18} /> },
	{ key: "square", title: "Квадрат — растянуть прямоугольник", icon: <SquareIcon size={18} /> },
	{ key: "lasso", title: "Лассо — обвести область", icon: <LassoIcon size={18} /> },
	{ key: "polygon", title: "Полигон — клики по карте", icon: <PolygonIcon size={18} /> }
];

const BTN_BASE =
	"flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ";
const BTN_INACTIVE = "border-slate-200 bg-white text-slate-700 hover:bg-slate-50";

/** Info-кнопка тулбара: не выбирается как инструмент, по наведению — Popover с подсказкой. */
function InfoButton() {
	const [open, setOpen] = useState(false);
	const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Небольшая задержка перед закрытием, чтобы курсор успел перейти с кнопки на содержимое.
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
					aria-label="Как выделить территорию"
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
				className="z-[600] w-[260px]"
			>
				<SelectionTips />
			</PopoverContent>
		</Popover>
	);
}

/** Плавающий тулбар выделения над картой: инструменты + info-кнопка с подсказкой. */
export function MapToolbar({ tool, onToolChange }: { tool: Tool; onToolChange: (t: Tool) => void }) {
	return (
		<div className="absolute left-3.5 top-3.5 z-[500] flex flex-col gap-1.5 rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_2px_4px_-2px_rgba(15,23,42,.12),0_4px_8px_-1px_rgba(15,23,42,.12)]">
			{TOOLS.map((t) => {
				const active = tool === t.key;
				return (
					<button
						key={t.key}
						type="button"
						title={t.title}
						aria-pressed={active}
						onClick={() => onToolChange(t.key)}
						className={
							BTN_BASE +
							(active ? "border-slate-900 bg-slate-900 text-white" : BTN_INACTIVE)
						}
					>
						{t.icon}
					</button>
				);
			})}
			<div className="my-0.5 h-px bg-slate-200" />
			<InfoButton />
		</div>
	);
}
