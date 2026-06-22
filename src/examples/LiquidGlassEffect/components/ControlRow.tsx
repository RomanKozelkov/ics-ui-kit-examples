import { Slider, SliderTrack, SliderRange, SliderThumb } from "ics-ui-kit/components/slider";

interface ControlRowProps {
	label: string;
	description: string;
	value: number;
	min: number;
	max: number;
	step: number;
	format?: (v: number) => string;
	onChange: (v: number) => void;
}

export function ControlRow({ label, description, value, min, max, step, format, onChange }: ControlRowProps) {
	const display = format ? format(value) : String(value);
	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-baseline justify-between gap-2">
				<div className="flex flex-col gap-0.5">
					<span className="text-xs font-semibold text-primary-fg">{label}</span>
					<span className="text-[11px] leading-tight text-secondary-fg">{description}</span>
				</div>
				<span className="shrink-0 rounded-md bg-primary-fg/5 px-2 py-0.5 font-mono text-xs tabular-nums text-primary-fg">
					{display}
				</span>
			</div>
			<Slider value={[value]} min={min} max={max} step={step} onValueChange={([v]) => onChange(v)}>
				<SliderTrack>
					<SliderRange />
				</SliderTrack>
				<SliderThumb />
			</Slider>
		</div>
	);
}
