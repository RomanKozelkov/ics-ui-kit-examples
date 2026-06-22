import * as React from "react";
import { Button } from "ics-ui-kit/components/button";
import { useLiquidGlass } from "../hooks/useLiquidGlass";
import { GlassBackground } from "../components/GlassBackground";
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
	const glass = useLiquidGlass({ blur, saturate, scale, aberration });

	return (
		<GlassBackground>
			<div className="absolute inset-0 z-10 flex items-center justify-center">
				<div
					ref={glass.ref}
					style={{
						...glass.style,
						borderRadius,
						border: "1px solid rgba(255,255,255,0.2)",
						background: "rgba(255,255,255,0.12)",
						resize: "both",
						minWidth: 226,
						minHeight: 130
					}}
					className="flex flex-col gap-3 overflow-hidden p-5 shadow-lg"
				>
					{glass.svgElement}
					<ProfileCard />
				</div>
			</div>
		</GlassBackground>
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
	const [borderRadius, setBorderRadius] = React.useState(20);

	const code = generateHookCode(blur, saturate, scale, aberration, borderRadius);

	return (
		<section className="flex flex-col gap-4">
			<SectionLabel
				number="2"
				title="useLiquidGlass — интерактивный плейграунд"
				subtitle="Крутите слайдеры — эффект меняется в реальном времени. Настройте параметры и скопируйте готовый вызов хука в свой проект."
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

			<CodeBlock label="Готовый вызов хука" code={code} />
		</section>
	);
}
