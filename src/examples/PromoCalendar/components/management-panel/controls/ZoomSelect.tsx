import { Slider, SliderTrack, SliderRange, SliderThumb } from "ics-ui-kit/components/slider";
import { IconButton } from "ics-ui-kit/components/button";
import { Field } from "ics-ui-kit/components/field";
import { Minus, Plus } from "lucide-react";
import { usePanelStore } from "../store/panel.store";
import { DAY_WIDTH_MIN, DAY_WIDTH_MAX, clampDayWidth } from "../data/options";
import { useText } from "../../../i18n";

// Шаг кнопок +/- и слайдера: ширина дня дискретна по DAY_WIDTH_MIN.
const ZOOM_STEP = DAY_WIDTH_MIN;

export function ZoomSelect() {
	const dayWidth = usePanelStore((s) => s.dayWidth);
	const setDayWidth = usePanelStore((s) => s.setDayWidth);
	const text = useText();

	const step = (delta: number) => setDayWidth(clampDayWidth(dayWidth + delta));

	return (
		<Field
			className="w-56"
			layout="horizontal"
			title={text("panel.zoom") + ":"}
			control={() => (
				<div className="flex items-center gap-2">
					<IconButton
						variant="outline"
						size="sm"
						icon={Minus}
						aria-label={text("panel.zoomOut")}
						disabled={dayWidth <= DAY_WIDTH_MIN}
						onClick={() => step(-ZOOM_STEP)}
					/>
					<Slider
						className="w-56"
						min={DAY_WIDTH_MIN}
						max={DAY_WIDTH_MAX}
						step={ZOOM_STEP}
						value={[dayWidth]}
						onValueChange={([v]) => setDayWidth(clampDayWidth(v))}
					>
						<SliderTrack>
							<SliderRange />
						</SliderTrack>
						<SliderThumb />
					</Slider>
					<IconButton
						variant="outline"
						size="sm"
						icon={Plus}
						aria-label={text("panel.zoomIn")}
						disabled={dayWidth >= DAY_WIDTH_MAX}
						onClick={() => step(ZOOM_STEP)}
					/>
				</div>
			)}
		/>
	);
}
