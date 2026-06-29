import * as React from "react";
import { Button } from "ics-ui-kit/components/button";
import { GlassBackground } from "../components/GlassBackground";
import { SectionLabel } from "../components/SectionLabel";
import { ControlRow } from "../components/ControlRow";
import { CodeBlock } from "../components/CodeBlock";
import { ProfileCard } from "../components/ProfileCard";

interface FrostedParams {
	blur: number;
	brightness: number;
	contrast: number;
	saturate: number;
	grayscale: number;
	sepia: number;
	hueRotate: number;
	invert: number;
	opacity: number;
}

function buildBackdropFilter(p: FrostedParams): string {
	return [
		`blur(${p.blur}px)`,
		`brightness(${p.brightness}%)`,
		`contrast(${p.contrast}%)`,
		`saturate(${p.saturate}%)`,
		`grayscale(${p.grayscale.toFixed(2)})`,
		`sepia(${p.sepia.toFixed(2)})`,
		`hue-rotate(${p.hueRotate}deg)`,
		`invert(${p.invert.toFixed(2)})`,
		`opacity(${p.opacity.toFixed(2)})`
	].join(" ");
}

function FrostedPreview(p: FrostedParams) {
	const backdropFilter = buildBackdropFilter(p);
	const cardStyle: React.CSSProperties = {
		backdropFilter,
		background: "rgba(255,255,255,0.12)",
		border: "1px solid rgba(255,255,255,0.2)",
		borderRadius: 20
	};

	return (
		<GlassBackground>
			<div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
				<div
					style={{ ...cardStyle, resize: "both", minWidth: 226, minHeight: 130 }}
					className="pointer-events-auto flex flex-col gap-3 overflow-hidden p-5 shadow-lg"
				>
					<ProfileCard />
				</div>
			</div>
		</GlassBackground>
	);
}

function generateCss(p: FrostedParams): string {
	const bf = buildBackdropFilter(p);
	return `.glass-card {
  backdrop-filter: ${bf};
}`;
}

const DEFAULTS: FrostedParams = {
	blur: 16,
	brightness: 100,
	contrast: 100,
	saturate: 180,
	grayscale: 0,
	sepia: 0,
	hueRotate: 0,
	invert: 0,
	opacity: 1
};

interface Preset {
	name: string;
	description: string;
	params: FrostedParams;
}

const PRESETS: Preset[] = [
	{
		name: "glass-clear",
		description: "Почти прозрачный — для accessibility-зон, hover-states, фоновых разделителей",
		params: { blur: 4, brightness: 100, contrast: 100, saturate: 100, grayscale: 0, sepia: 0, hueRotate: 0, invert: 0, opacity: 0.6 }
	},
	{
		name: "glass-thin",
		description: "Chips, теги, badge, tooltip, hover-подсветки",
		params: { blur: 8, brightness: 108, contrast: 100, saturate: 120, grayscale: 0, sepia: 0, hueRotate: 0, invert: 0, opacity: 1 }
	},
	{
		name: "glass-regular",
		description: "Карточки, панели, sidebar, попапы — основной рабочий пресет",
		params: { blur: 16, brightness: 100, contrast: 100, saturate: 180, grayscale: 0, sepia: 0, hueRotate: 0, invert: 0, opacity: 1 }
	},
	{
		name: "glass-thick",
		description: "Модальные окна, drawer, fullscreen overlay",
		params: { blur: 24, brightness: 96, contrast: 102, saturate: 200, grayscale: 0, sepia: 0, hueRotate: 0, invert: 0, opacity: 1 }
	}
];

function formatPresetValues(p: FrostedParams): string {
	const parts = [`blur(${p.blur}px)`, `brightness(${p.brightness}%)`, `saturate(${p.saturate}%)`];
	if (p.contrast !== 100) parts.push(`contrast(${p.contrast}%)`);
	if (p.opacity !== 1) parts.push(`opacity(${p.opacity})`);
	return parts.join(" ");
}

export function FrostedGlassPlaygroundExample() {
	const [params, setParams] = React.useState<FrostedParams>(DEFAULTS);
	const [activePreset, setActivePreset] = React.useState<string | null>("glass-regular");

	const set =
		<K extends keyof FrostedParams>(key: K) =>
		(v: number) => {
			setActivePreset(null);
			setParams((prev) => ({ ...prev, [key]: v }));
		};

	const applyPreset = (preset: Preset) => {
		setParams(preset.params);
		setActivePreset(preset.name);
	};

	const code = activePreset
		? `<div class="${activePreset}">...</div>`
		: generateCss(params);

	const codeLabel = activePreset ? "Tailwind" : "Готовый CSS";

	return (
		<section className="flex flex-col gap-4">
			<SectionLabel
				number="1"
				title="Frosted Glass — интерактивный плейграунд"
				subtitle="Чистый CSS backdrop-filter без JS. Подходит для статичных элементов: карточки, панели, модалки. Крутите слайдеры и копируйте готовый CSS в свой проект."
			/>

			<div className="grid grid-cols-[1fr_300px] items-stretch gap-4">
				<FrostedPreview {...params} />

				<div className="flex flex-col gap-4 rounded-2xl border border-secondary-border bg-secondary-bg p-5">
					<p className="text-[11px] font-semibold uppercase tracking-widest text-secondary-fg">
						Пресеты
					</p>

					<div className="flex flex-col gap-2">
						{PRESETS.map((preset) => {
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
									<p className="mb-0.5 font-mono text-xs font-semibold">{preset.name}</p>
									<p className="mb-1 font-mono text-[10px] text-muted">{formatPresetValues(preset.params)}</p>
									<p className="text-[11px] leading-tight text-muted">{preset.description}</p>
								</button>
							);
						})}
					</div>

					<p className="text-[11px] font-semibold uppercase tracking-widest text-secondary-fg">
						backdrop-filter
					</p>

					<ControlRow
						label="blur"
						description="Размытие подложки"
						value={params.blur}
						min={0}
						max={40}
						step={1}
						format={(v) => `${v}px`}
						onChange={set("blur")}
					/>
					<ControlRow
						label="brightness"
						description="Яркость"
						value={params.brightness}
						min={0}
						max={300}
						step={5}
						format={(v) => `${v}%`}
						onChange={set("brightness")}
					/>
					<ControlRow
						label="contrast"
						description="Контрастность"
						value={params.contrast}
						min={0}
						max={300}
						step={5}
						format={(v) => `${v}%`}
						onChange={set("contrast")}
					/>
					<ControlRow
						label="saturate"
						description="Насыщенность"
						value={params.saturate}
						min={0}
						max={500}
						step={10}
						format={(v) => `${v}%`}
						onChange={set("saturate")}
					/>
					<ControlRow
						label="grayscale"
						description="Обесцвечивание"
						value={params.grayscale}
						min={0}
						max={1}
						step={0.01}
						format={(v) => v.toFixed(2)}
						onChange={set("grayscale")}
					/>
					<ControlRow
						label="sepia"
						description="Сепия"
						value={params.sepia}
						min={0}
						max={1}
						step={0.01}
						format={(v) => v.toFixed(2)}
						onChange={set("sepia")}
					/>
					<ControlRow
						label="hue-rotate"
						description="Сдвиг оттенка"
						value={params.hueRotate}
						min={0}
						max={360}
						step={1}
						format={(v) => `${v}deg`}
						onChange={set("hueRotate")}
					/>
					<ControlRow
						label="invert"
						description="Инверсия"
						value={params.invert}
						min={0}
						max={1}
						step={0.01}
						format={(v) => v.toFixed(2)}
						onChange={set("invert")}
					/>
					<ControlRow
						label="opacity"
						description="Прозрачность"
						value={params.opacity}
						min={0}
						max={1}
						step={0.01}
						format={(v) => v.toFixed(2)}
						onChange={set("opacity")}
					/>

					<Button variant="secondary" size="sm" className="mt-auto gap-2" onClick={() => setParams(DEFAULTS)}>
						Сбросить
					</Button>
				</div>
			</div>

			<CodeBlock label={codeLabel} code={code} />
		</section>
	);
}
