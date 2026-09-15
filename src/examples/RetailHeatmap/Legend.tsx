import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "ics-ui-kit/components/select";
import { Slider, SliderRange, SliderThumb, SliderTrack } from "ics-ui-kit/components/slider";
import { formatMetric } from "../../shared/bi-dashboard/format";
import type { MapLayer } from "./MapView";
import { HEAT_GRADIENT } from "./stats";
import { COLOR_METRICS, type ColorMetric } from "./types";

/**
 * Легенда снизу-слева: выбор метрики раскраски территорий, шкала интенсивности и
 * регулятор непрозрачности заливки (треб. 7.1, 7.2). В требованиях регулятор назван
 * «прозрачность», но 100 % на нём — полностью залитая территория, поэтому подпись
 * приведена к фактическому смыслу.
 */

/** Подписи концов шкалы: для денежных метрик — значения, для количества — «меньше/больше». */
function scaleBounds(metric: ColorMetric, max: number): [string, string] {
	if (metric === "count") return ["меньше", `${formatMetric(max, "Units", "full")} тт`];
	return ["0", formatMetric(max, "RUB", "compact")];
}

/**
 * Слой, который залит цветом и доступен для выбора кликом. Округа и районы — базовая
 * география (треб. 2.1), «Брики» оставляет на карте только кастомную нарезку, без базового
 * слоя под ней. Брики видны при любом выборе — они лежат поверх базового слоя (треб. 2.5).
 */
const LAYERS: { key: MapLayer; label: string }[] = [
	{ key: "okrug", label: "Округа" },
	{ key: "rayon", label: "Районы" },
	{ key: "brick", label: "Брики" }
];

export function Legend({
	metric,
	onMetricChange,
	maxValue,
	layer,
	onLayerChange,
	opacity,
	onOpacityChange
}: {
	metric: ColorMetric;
	onMetricChange: (metric: ColorMetric) => void;
	/** Верхняя граница шкалы — максимум метрики среди видимых территорий. */
	maxValue: number;
	layer: MapLayer;
	onLayerChange: (layer: MapLayer) => void;
	opacity: number;
	onOpacityChange: (value: number) => void;
}) {
	const [from, to] = scaleBounds(metric, maxValue);

	return (
		<div className="absolute bottom-3.5 left-3.5 z-[500] w-[248px] rounded-xl border border-slate-200 bg-white p-[13px] shadow-[0_2px_4px_-2px_rgba(15,23,42,.12),0_4px_8px_-1px_rgba(15,23,42,.12)]">
			<div className="mb-2 flex items-center justify-between gap-2">
				<span className="text-[11px] font-semibold text-slate-900">Слой</span>
				<div className="flex overflow-hidden rounded-md border border-slate-200">
					{LAYERS.map((item) => (
						<button
							key={item.key}
							type="button"
							onClick={() => onLayerChange(item.key)}
							aria-pressed={layer === item.key}
							className={
								"px-2 py-[3px] text-[11px] font-medium transition-colors " +
								(layer === item.key
									? "bg-slate-900 text-white"
									: "bg-white text-slate-600 hover:bg-slate-50")
							}
						>
							{item.label}
						</button>
					))}
				</div>
			</div>
			<div className="mb-2 text-[11px] font-semibold text-slate-900">Интенсивность заливки</div>
			<Select value={metric} onValueChange={(value) => onMetricChange(value as ColorMetric)}>
				<SelectTrigger className="h-8 w-full text-[12px]" aria-label="Метрика раскраски">
					<SelectValue placeholder="Метрика" />
				</SelectTrigger>
				<SelectContent className="z-[700]">
					{COLOR_METRICS.map((m) => (
						<SelectItem key={m.key} value={m.key}>
							{m.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<div className="mb-1 mt-[11px] h-2.5 rounded-[5px]" style={{ background: HEAT_GRADIENT }} />
			<div className="flex justify-between text-[11px] tabular-nums text-slate-500">
				<span>{from}</span>
				<span>{to}</span>
			</div>

			<div className="my-[11px] h-px bg-[#f0f4f8]" />

			<div className="mb-2 flex items-center justify-between">
				<span className="text-[11px] font-semibold text-slate-900">Непрозрачность</span>
				<span className="text-[11px] tabular-nums text-slate-500">{Math.round(opacity * 100)}%</span>
			</div>
			<Slider
				value={[opacity]}
				min={0}
				max={1}
				step={0.05}
				aria-label="Непрозрачность заливки территорий"
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
