import * as React from "react";
import { Button } from "ics-ui-kit/components/button";
import { CodeBlock, ControlRow, SCROLL_ITEMS, SectionLabel } from "./shared";

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
				<div style={cardStyle} className="flex w-56 flex-col gap-3 p-5 shadow-lg">
					<div className="flex items-center gap-3">
						<div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/30 text-sm font-semibold text-white">
							АК
						</div>
						<div className="flex flex-col gap-0.5">
							<span className="text-sm font-semibold leading-tight text-white">Алексей Кириллов</span>
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

export function FrostedGlassPlaygroundExample() {
	const [params, setParams] = React.useState<FrostedParams>(DEFAULTS);
	const set =
		<K extends keyof FrostedParams>(key: K) =>
		(v: number) =>
			setParams((prev) => ({ ...prev, [key]: v }));

	const css = generateCss(params);

	return (
		<section className="flex flex-col gap-4">
			<SectionLabel
				number="1"
				title="Frosted Glass — интерактивный плейграунд"
				subtitle="Крутите слайдеры — все параметры backdrop-filter меняются в реальном времени. Скопируйте готовый CSS в свой проект."
			/>

			<div className="grid grid-cols-[1fr_300px] gap-4">
				<FrostedPreview {...params} />

				<div className="flex flex-col gap-4 rounded-2xl border border-secondary-border bg-secondary-bg p-5">
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

			<CodeBlock label="Готовый CSS" code={css} />
		</section>
	);
}
