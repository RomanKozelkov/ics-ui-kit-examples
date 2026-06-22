import {
	Slider,
	SliderRange,
	SliderThumb,
	SliderTrack
} from "ics-ui-kit/components/slider";

const HEAT_GRADIENT =
	"linear-gradient(90deg,rgb(255,255,178),rgb(254,204,92),rgb(253,141,60),rgb(240,59,32),rgb(189,0,38))";

/** Легенда снизу-слева: шкала интенсивности (количество точек) + слайдер прозрачности бриков. */
export function Legend({
	opacity,
	onOpacityChange
}: {
	opacity: number;
	onOpacityChange: (value: number) => void;
}) {
	return (
		<div className="absolute bottom-3.5 left-3.5 z-[500] w-[232px] rounded-xl border border-slate-200 bg-white p-[13px] shadow-[0_2px_4px_-2px_rgba(15,23,42,.12),0_4px_8px_-1px_rgba(15,23,42,.12)]">
			<div className="text-[11px] font-semibold text-slate-900">Интенсивность · Количество точек</div>
			<div className="my-[9px] mb-1 h-2.5 rounded-[5px]" style={{ background: HEAT_GRADIENT }} />
			<div className="flex justify-between text-[11px] text-slate-500">
				<span>меньше</span>
				<span>больше</span>
			</div>

			<div className="my-[11px] h-px bg-[#f0f4f8]" />

			<div className="mb-2 flex items-center justify-between">
				<span className="text-[11px] font-semibold text-slate-900">Прозрачность</span>
				<span className="text-[11px] tabular-nums text-slate-500">{Math.round(opacity * 100)}%</span>
			</div>
			<Slider
				value={[opacity]}
				min={0}
				max={1}
				step={0.05}
				aria-label="Прозрачность бриков"
				onValueChange={([v]) => onOpacityChange(v)}
			>
				<SliderTrack>
					<SliderRange />
				</SliderTrack>
				<SliderThumb />
			</Slider>
		</div>
	);
}
