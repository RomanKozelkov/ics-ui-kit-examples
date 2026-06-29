import * as React from "react";
import { Button } from "ics-ui-kit/components/button";
import { GlassBackground } from "../components/GlassBackground";
import { LiquidGlassContainer } from "../components/LiquidGlassContainer";
import { ControlRow } from "../components/ControlRow";
import { CodeBlock } from "../components/CodeBlock";
import { SectionLabel } from "../components/SectionLabel";
import { ProfileCard } from "../components/ProfileCard";

interface GlassPreviewProps {
	blur: number;
	saturate: number;
	scale: number;
	aberration: number;
	borderRadius: number;
}

function GlassPreview({ blur, saturate, scale, aberration, borderRadius }: GlassPreviewProps) {
	return (
		<GlassBackground>
			<div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
				<LiquidGlassContainer
					blur={blur}
					saturate={saturate}
					scale={scale}
					aberration={aberration}
					borderRadius={borderRadius}
					style={{
						border: "1px solid rgba(255,255,255,0.2)",
						background: "rgba(255,255,255,0.12)",
						resize: "both",
						minWidth: 226,
						minHeight: 130
					}}
					className="pointer-events-auto flex flex-col gap-3 overflow-hidden p-5 shadow-lg"
				>
					<ProfileCard />
				</LiquidGlassContainer>
			</div>
		</GlassBackground>
	);
}

function generateCode(blur: number, saturate: number, scale: number, aberration: number, borderRadius: number): string {
	return [
		`<LiquidGlassContainer`,
		`  blur={${blur}}`,
		`  saturate={${saturate.toFixed(1)}}`,
		`  scale={${scale}}`,
		`  aberration={${aberration.toFixed(2)}}`,
		`  borderRadius={${borderRadius}}`,
		`  className="..."`,
		`>`,
		`  {/* контент */}`,
		`</LiquidGlassContainer>`
	].join("\n");
}

interface LiquidPreset {
	name: string;
	label: string;
	description: string;
	dots: number;
	blur: number;
	saturate: number;
	scale: number;
	aberration: number;
	borderRadius: number;
}

const LIQUID_PRESETS: LiquidPreset[] = [
	{
		name: "liquid-subtle",
		label: "деликатный",
		description: "Маленькие элементы: теги, чипы, иконки, аватары. Эффект читается, но не «кричит». Хорошо работает в плотных списках.",
		dots: 1,
		blur: 3,
		saturate: 1.1,
		scale: 28,
		aberration: 0.02,
		borderRadius: 40
	},
	{
		name: "liquid-regular",
		label: "стандартный",
		description: "Карточки, кнопки, панели — основной пресет. Это ваш текущий дефолт, он хорошо сбалансирован.",
		dots: 2,
		blur: 7,
		saturate: 1.4,
		scale: 50,
		aberration: 0.06,
		borderRadius: 20
	},
	{
		name: "liquid-expressive",
		label: "выразительный",
		description: "Hero-секции, FAB, onboarding-экраны, промо-блоки. Использовать редко — как акцент, не как фон.",
		dots: 3,
		blur: 5,
		saturate: 1.7,
		scale: 65,
		aberration: 0.10,
		borderRadius: 28
	}
];

export function LiquidGlassPlaygroundExample() {
	const [blur, setBlur] = React.useState(7);
	const [saturate, setSaturate] = React.useState(1.4);
	const [scale, setScale] = React.useState(50);
	const [aberration, setAberration] = React.useState(0.06);
	const [borderRadius, setBorderRadius] = React.useState(20);
	const [activePreset, setActivePreset] = React.useState<string | null>("liquid-regular");

	const applyPreset = (preset: LiquidPreset) => {
		setBlur(preset.blur);
		setSaturate(preset.saturate);
		setScale(preset.scale);
		setAberration(preset.aberration);
		setBorderRadius(preset.borderRadius);
		setActivePreset(preset.name);
	};

	const clearPreset = () => setActivePreset(null);

	const code = generateCode(blur, saturate, scale, aberration, borderRadius);

	return (
		<section className="flex flex-col gap-4">
			<SectionLabel
				number="2"
				title="Liquid Glass — интерактивный плейграунд"
				subtitle="SVG-дисторсия + хроматическая аберрация — «живой» линзовый эффект в стиле Apple Liquid Glass. Подходит когда нужно искажение по краям, элемент меняет размер (ResizeObserver внутри), или контент под стеклом детализированный. Тяжелее Frosted Glass — не используйте для десятков элементов на экране."
			/>

			<div className="grid grid-cols-[1fr_300px] items-stretch gap-4">
				<GlassPreview
					blur={blur}
					saturate={saturate}
					scale={scale}
					aberration={aberration}
					borderRadius={borderRadius}
				/>

				<div className="flex flex-col gap-5 rounded-2xl border border-secondary-border bg-secondary-bg p-5">
					<p className="text-[11px] font-semibold uppercase tracking-widest text-secondary-fg">
						Градация по выразительности
					</p>

					<div className="flex flex-col gap-2">
						{LIQUID_PRESETS.map((preset) => {
							const isActive = activePreset === preset.name;
							return (
								<button
									key={preset.name}
									onClick={() => applyPreset(preset)}
									className={`rounded-xl border p-3 text-left transition-colors ${
										isActive
											? "border-primary-accent bg-primary-accent/8 text-primary-fg"
											: "border-secondary-border bg-secondary-bg-hover text-secondary-fg hover:border-primary-border"
									}`}
								>
									<div className="mb-1 flex items-baseline gap-2">
										<span className="font-mono text-xs font-semibold">{preset.name}</span>
										<span className="text-[11px] text-muted">{preset.label}</span>
									</div>
									<div className="mb-2 flex gap-1">
										{Array.from({ length: 3 }).map((_, i) => (
											<span
												key={i}
												className={`size-2 rounded-full ${i < preset.dots ? "bg-status-info" : "bg-secondary-border"}`}
											/>
										))}
									</div>
									<div className="mb-1 font-mono text-[10px] text-muted">
										blur={`{${preset.blur}}`} saturate={`{${preset.saturate.toFixed(1)}}`} scale={`{${preset.scale}}`}
										{"\n"}aberration={`{${preset.aberration.toFixed(2)}}`} borderRadius={`{${preset.borderRadius}}`}
									</div>
									<p className="text-[11px] leading-tight text-muted">{preset.description}</p>
								</button>
							);
						})}
					</div>

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
							setBorderRadius(20);
						}}
					>
						Сбросить
					</Button>
				</div>
			</div>

			<CodeBlock label="Пример разметки" code={code} />
		</section>
	);
}
