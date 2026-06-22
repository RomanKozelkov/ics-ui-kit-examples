import { CursorIcon, LassoIcon, PolygonIcon, SquareIcon } from "./toolIcons";

const TIPS = [
	{ icon: <CursorIcon />, text: "Курсор — клик по точке или брику" },
	{ icon: <SquareIcon />, text: "Квадрат — зажмите и растяните прямоугольник" },
	{ icon: <LassoIcon />, text: "Лассо — зажмите и обведите область" },
	{ icon: <PolygonIcon />, text: "Полигон — клики по карте, клик по первой точке завершает" }
];

/** Подсказка «Как выделить территорию» — используется в Popover info-кнопки тулбара. */
export function SelectionTips() {
	return (
		<div>
			<div className="mb-[9px] text-[12px] font-semibold text-slate-900">Как выделить территорию</div>
			<div className="flex flex-col gap-2">
				{TIPS.map((t) => (
					<div key={t.text} className="flex items-center gap-[9px]">
						<span className="flex h-6 w-6 flex-none items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700">
							{t.icon}
						</span>
						<span className="text-[12px] text-slate-700">{t.text}</span>
					</div>
				))}
			</div>
		</div>
	);
}
