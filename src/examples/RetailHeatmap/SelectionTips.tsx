import { Combine, Scissors } from "lucide-react";
import { CursorIcon, LassoIcon, PolygonIcon, SquareIcon } from "./toolIcons";

const TIPS = [
	{ icon: <CursorIcon />, text: "Курсор — клик по территории или точке" },
	{ icon: <SquareIcon />, text: "Прямоугольник — зажмите и растяните область" },
	{ icon: <LassoIcon />, text: "Лассо — зажмите и обведите область" },
	{ icon: <PolygonIcon />, text: "Полигон — клики по карте, клик по первой точке завершает" },
	{ icon: <Scissors size={14} />, text: "Разрез — проведите линию через территорию, части станут бриками" },
	{ icon: <Combine size={14} />, text: "Объединение — выберите территории и подтвердите" }
];

/** Подсказка «Как нарезать территорию» — в поповере info-кнопки тулбара. */
export function SelectionTips() {
	return (
		<div>
			<div className="mb-[9px] text-[12px] font-semibold text-slate-900">Как нарезать территорию</div>
			<div className="flex flex-col gap-2">
				{TIPS.map((tip) => (
					<div key={tip.text} className="flex items-start gap-[9px]">
						<span className="flex h-6 w-6 flex-none items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700">
							{tip.icon}
						</span>
						<span className="text-[12px] leading-snug text-slate-700">{tip.text}</span>
					</div>
				))}
			</div>
			<div className="mt-[11px] border-t border-slate-100 pt-2 text-[11px] leading-snug text-slate-500">
				Область нового брика вырезается из территории, в которой он нарисован: брики не
				перекрываются, а удаление брика возвращает территорию в исходное состояние.
			</div>
		</div>
	);
}
