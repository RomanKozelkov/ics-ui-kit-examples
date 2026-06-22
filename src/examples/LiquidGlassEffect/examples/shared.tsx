import * as React from "react";
import { Slider, SliderTrack, SliderRange, SliderThumb } from "ics-ui-kit/components/slider";
import { Button } from "ics-ui-kit/components/button";
import { Check, Copy } from "lucide-react";

export const SCROLL_ITEMS = Array.from({ length: 20 }, (_, i) => i);

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

export function CodeBlock({ label, code }: { label: string; code: string }) {
	const [copied, setCopied] = React.useState(false);

	const handleCopy = React.useCallback(async () => {
		await navigator.clipboard.writeText(code);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}, [code]);

	return (
		<div className="overflow-hidden rounded-2xl border border-secondary-border">
			<div className="flex items-center justify-between border-b border-secondary-border bg-secondary-bg px-4 py-2.5">
				<span className="text-xs font-medium text-secondary-fg">{label}</span>
				<Button size="xs" variant="secondary" className="gap-1.5" onClick={handleCopy}>
					{copied ? <Check className="size-3" /> : <Copy className="size-3" />}
					{copied ? "Скопировано" : "Копировать"}
				</Button>
			</div>
			<pre className="overflow-x-auto bg-primary-bg p-4 font-mono text-xs leading-relaxed text-primary-fg">
				<code>{code}</code>
			</pre>
		</div>
	);
}

export function SectionLabel({ number, title, subtitle }: { number: string; title: string; subtitle: string }) {
	return (
		<div className="flex items-start gap-3 pb-1">
			<span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-fg/10 text-xs font-bold text-primary-fg">
				{number}
			</span>
			<div>
				<p className="text-sm font-semibold text-primary-fg">{title}</p>
				<p className="text-xs text-secondary-fg">{subtitle}</p>
			</div>
		</div>
	);
}
