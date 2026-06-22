import * as React from "react";
import { Slider, SliderTrack, SliderRange, SliderThumb } from "ics-ui-kit/components/slider";
import { Button } from "ics-ui-kit/components/button";
import { Check, Copy } from "lucide-react";
import { useLiquidGlass } from "../hooks/useLiquidGlass";
import { SectionLabel } from "./shared";

const SCROLL_ITEMS = Array.from({ length: 20 }, (_, i) => i);

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

function ControlRow({ label, description, value, min, max, step, format, onChange }: ControlRowProps) {
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

interface GlassPreviewProps {
	blur: number;
	saturate: number;
	scale: number;
	aberration: number;
	borderRadius: number;
}

function GlassPreview({ blur, saturate, scale, aberration, borderRadius }: GlassPreviewProps) {
	const glass = useLiquidGlass({ blur, saturate, scale, aberration });

	return (
		<div className="relative h-[360px] overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 via-purple-400 to-fuchsia-500">
			<div className="absolute inset-0 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
				<div className="flex flex-col gap-2 p-4">
					{SCROLL_ITEMS.map((i) => (
						<div
							key={i}
							className="flex h-14 items-center rounded-xl border border-white/20 bg-white/20 px-4"
						>
							<span className="text-sm font-medium text-white/90">Строка {i + 1}</span>
						</div>
					))}
				</div>
			</div>

			<div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
				<div
					ref={glass.ref}
					style={{ ...glass.style, borderRadius }}
					className="flex w-56 flex-col gap-3 p-5 shadow-lg"
				>
					{glass.svgElement}
					<div className="flex items-center gap-3">
						<div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/30 text-sm font-semibold text-white">
							АК
						</div>
						<div className="flex flex-col gap-0.5">
							<span className="text-sm font-semibold leading-tight text-white">
								Алексей Кириллов
							</span>
							<span className="text-xs text-white/70">Frontend Developer</span>
						</div>
					</div>
					<div className="flex flex-col gap-1">
						<span className="text-xs text-white/70">email@example.com</span>
						<span className="text-xs text-white/70">Москва, Россия</span>
					</div>
				</div>
			</div>
		</div>
	);
}

function generateHookCode(
	blur: number,
	saturate: number,
	scale: number,
	aberration: number,
	borderRadius: number
): string {
	const lines = [
		`const { ref, style, svgElement } = useLiquidGlass({`,
		`  blur: ${blur},`,
		`  saturate: ${saturate.toFixed(1)},`,
		`  scale: ${scale},`,
		`  aberration: ${aberration.toFixed(2)},`,
		`});`,
		``,
		`// Применяйте к элементу:`,
		`// <div ref={ref} style={{ ...style, borderRadius: ${borderRadius} }}>`,
		`//   {svgElement}`,
		`//   ...контент`,
		`// </div>`
	];
	return lines.join("\n");
}

export function HookPlaygroundExample() {
	const [blur, setBlur] = React.useState(7);
	const [saturate, setSaturate] = React.useState(1.4);
	const [scale, setScale] = React.useState(50);
	const [aberration, setAberration] = React.useState(0.06);
	const [borderRadius, setBorderRadius] = React.useState(24);
	const [copied, setCopied] = React.useState(false);

	const code = generateHookCode(blur, saturate, scale, aberration, borderRadius);

	const handleCopy = React.useCallback(async () => {
		await navigator.clipboard.writeText(code);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}, [code]);

	return (
		<section className="flex flex-col gap-4">
			<SectionLabel
				number="1"
				title="useLiquidGlass — интерактивный плейграунд"
				subtitle="Крутите слайдеры — эффект меняется в реальном времени. Настройте параметры и скопируйте готовый вызов хука в свой проект."
			/>

			<div className="grid grid-cols-[1fr_300px] gap-4">
				<GlassPreview
					blur={blur}
					saturate={saturate}
					scale={scale}
					aberration={aberration}
					borderRadius={borderRadius}
				/>

				<div className="flex flex-col gap-5 rounded-2xl border border-secondary-border bg-secondary-bg p-5">
					<p className="text-[11px] font-semibold uppercase tracking-widest text-secondary-fg">Параметры</p>

					<ControlRow
						label="Blur"
						description="Интенсивность размытия подложки"
						value={blur}
						min={0}
						max={20}
						step={1}
						format={(v) => `${v}px`}
						onChange={setBlur}
					/>

					<ControlRow
						label="Saturate"
						description="Насыщенность цветов через стекло"
						value={saturate}
						min={1}
						max={3}
						step={0.1}
						format={(v) => `${v.toFixed(1)}`}
						onChange={setSaturate}
					/>

					<ControlRow
						label="Scale"
						description="Сила искажения по краям"
						value={scale}
						min={0}
						max={100}
						step={1}
						onChange={setScale}
					/>

					<ControlRow
						label="Aberration"
						description="Хроматическая аберрация (RGB-сдвиг)"
						value={aberration}
						min={0}
						max={0.5}
						step={0.01}
						format={(v) => v.toFixed(2)}
						onChange={setAberration}
					/>

					<ControlRow
						label="Border Radius"
						description="Скругление углов карточки"
						value={borderRadius}
						min={0}
						max={48}
						step={2}
						format={(v) => `${v}px`}
						onChange={setBorderRadius}
					/>

					<Button
						variant="secondary"
						size="sm"
						className="mt-auto gap-2"
						onClick={() => {
							setBlur(7);
							setSaturate(1.4);
							setScale(50);
							setAberration(0.06);
							setBorderRadius(24);
						}}
					>
						Сбросить
					</Button>
				</div>
			</div>

			<div className="overflow-hidden rounded-2xl border border-secondary-border">
				<div className="flex items-center justify-between border-b border-secondary-border bg-secondary-bg px-4 py-2.5">
					<span className="text-xs font-medium text-secondary-fg">Готовый вызов хука</span>
					<Button size="xs" variant="secondary" className="gap-1.5" onClick={handleCopy}>
						{copied ? <Check className="size-3" /> : <Copy className="size-3" />}
						{copied ? "Скопировано" : "Копировать"}
					</Button>
				</div>
				<pre className="overflow-x-auto bg-primary-bg p-4 font-mono text-xs leading-relaxed text-primary-fg">
					<code>{code}</code>
				</pre>
			</div>
		</section>
	);
}
